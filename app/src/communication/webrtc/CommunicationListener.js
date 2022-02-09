import React, { Component } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../../redux/store/store';
import App from '../../App';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
  FINISHED,
} from './messages';
import {
  startGame,
  setListState,
  setFieldState,
  listEvent,
  fieldEvent,
  finishEvent,
} from '../../redux/actions';
import { shuffleCodeblocks } from '../../utils/shuffleCodeblocks/shuffleCodeblocks';
import { STATUS } from '../../utils/constants';

/**
 * Helper function to retrive data from the redux store.
 *
 * @param {*} state : Redux store
 * @returns
 */
const mapStateToProps = (state) => ({
  handList: state.handList,
  solutionField: state.solutionField,
  currentTask: state.currentTask,
  listEvent: state.listEvent,
  fieldEvent: state.fieldEvent,
  taskEvent: state.taskEvent,
  clearEvent: state.clearEvent,
  status: state.status,
  players: state.players,
  finishEvent: state.finishEvent,
});

/** Helper function to let us call dispatch from a class function
 *
 * @param {*} dispatch
 * @returns
 */
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setListState: (...args) => dispatch(setListState(...args)),
    dispatch_setFieldState: (...args) => dispatch(setFieldState(...args)),
    dispatch_startGame: (...args) => dispatch(startGame(...args)),
    dispatch_listEvent: (...args) => dispatch(listEvent(...args)),
    dispatch_fieldEvent: (...args) => dispatch(fieldEvent(...args)),
    dispatch_finishEvent: (...args) => dispatch(finishEvent(...args)),
  };
}

/**
 * Listens to changes in the redux store and sends new messages to all peers.
 */
class CommunicationListener extends Component {
  /**
   * Distribute cards to all players, including yourself
   */
  initialize_board() {
    // Read task information from redux store
    const state = store.getState();
    const currentTask = state.currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];
    let solutionField = currentTaskObject.field;
    //let handList = currentTaskObject.handList;

    // initalize solutionfield
    const { dispatch_setFieldState } = this.props;
    dispatch_setFieldState(solutionField);

    // Create new arrays to prevent mutation
    let shuffleBlocks = [...currentTaskObject.codeBlocks];
    let shuffleDistractors = [...currentTaskObject.distractors];

    // Set indent to 0 for blocks in the hand
    shuffleBlocks = shuffleBlocks.map((block) => ({ ...block, indent: 0 }));
    shuffleDistractors = shuffleDistractors.map((block) => ({
      ...block,
      indent: 0,
    }));

    // shuffle codeblocks
    let codeblocks = shuffleCodeblocks(
      shuffleBlocks,
      shuffleDistractors,
      state.players.length
    );

    // initialize handLists
    const { dispatch_setListState } = this.props;
    dispatch_setListState(codeblocks);
  }

  /**
   * Start the game for all players
   */
  start() {
    this.initialize_board();
    const { dispatch_startGame } = this.props;
    dispatch_startGame();
  }

  /**
   * Notifies other peers when this player changes the state
   *
   * @param {*} prevProps : Checks that the new value is different
   */
  componentDidUpdate(prevProps) {
    const state = store.getState();

    if (prevProps.listEvent !== this.props.listEvent) {
      // This peer moved codeblock in an handlist
      const json = JSON.stringify(state.handList);
      this.props.webrtc.shout(SET_LIST, json);
    } else if (prevProps.fieldEvent !== this.props.fieldEvent) {
      // This peer moved codeblock in soloutionfield
      const json = JSON.stringify(state.solutionField);
      this.props.webrtc.shout(SET_FIELD, json);
    } else if (
      // This peer updated the game state by going to the next task
      prevProps.taskEvent !== this.props.taskEvent
    ) {
      this.initialize_board();
      const json = JSON.stringify({
        currentTask: state.currentTask,
        handList: state.handList,
        solutionField: state.solutionField,
      });
      this.props.webrtc.shout(NEXT_TASK, json);
      const { dispatch_listEvent } = this.props;
      dispatch_listEvent();
    } else if (prevProps.clearEvent !== this.props.clearEvent) {
      // This peer cleared the board
      const json = JSON.stringify(state.currentTask);
      this.props.webrtc.shout(CLEAR_TASK, json);
    } else if (prevProps.status !== this.props.status) {
      // This player started the game from the lobby
      let playerIds = state.players.map((p) => p.id);

      const json = JSON.stringify({
        status: state.status,
        handList: state.handList,
        solutionField: state.solutionField,
        playerIds: playerIds,
      });
      if (state.status === STATUS.GAME) {
        this.props.webrtc.shout(START_GAME, json);
      }
    } else if (prevProps.finishEvent !== this.props.finishEvent) {
      this.props.webrtc.shout(FINISHED, '');
    }
  }

  render() {
    return <App startGame={() => this.start()} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebRTC(CommunicationListener));
