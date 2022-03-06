import React, { Component } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../../../redux/store/store';
import App from '../../../App';
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
} from '../../../redux/actions';
import { shuffleCodeblocks } from '../../../utils/shuffleCodeblocks/shuffleCodeblocks';
import { STATUS } from '../../../utils/constants';
import configData from '../../../config.json';

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
  constructor(props) {
    super(props);
    this.state = {
      fieldMessage: {},
      listMessage: {},
    };
  }

  isProduction = JSON.parse(configData.PRODUCTION);
  EVENT_DELAY = 500;

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
   * Notify other peers with shout and the signaling server with broadcast
   *
   * @param {*} type : event sent
   * @param {*} payload : data sent
   */
  shout(type, payload) {
    if (this.isProduction) {
      this.props.webrtc.broadcast(type, payload);
    } else {
      this.props.webrtc.shout(type, payload);
    }
  }

  /**
   * Notifies other peers when this player changes the state
   *
   * @param {*} prevProps : Checks that the new value is different
   */
  componentDidUpdate(prevProps) {
    const state = store.getState();

    if (prevProps.listEvent.getTime() < this.props.listEvent.getTime()) {
      // This peer moved codeblock in an handlist
      const json = JSON.stringify(state.handList);
      this.setState({ json });
      setTimeout(() => {
        this.shout(SET_LIST, json);
      }, this.EVENT_DELAY);
    } else if (
      prevProps.fieldEvent.getTime() < this.props.fieldEvent.getTime()
    ) {
      // This peer moved codeblock in soloutionfield
      const json = JSON.stringify(state.solutionField);
      this.setState({ json });
      setTimeout(() => {
        this.shout(SET_FIELD, json);
      }, this.EVENT_DELAY);
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
      this.shout(NEXT_TASK, json);
      const { dispatch_listEvent } = this.props;
      dispatch_listEvent();
    } else if (
      prevProps.clearEvent.getTime() < this.props.clearEvent.getTime()
    ) {
      // This peer cleared the board
      const json = JSON.stringify(state.currentTask);
      this.shout(CLEAR_TASK, json);
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
        this.shout(START_GAME, json);
      }
    } else if (prevProps.finishEvent !== this.props.finishEvent) {
      this.shout(FINISHED, '');
    }

    //Warn users leaving page
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = '';
      }
      return '';
    };
  }

  render() {
    return <App startGame={() => this.start()} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebRTC(CommunicationListener));
