import React, { Component } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../redux/store/store';
import App from '../App';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
} from './messages';
import {
  startGame,
  setListState,
  setFieldState,
  listShoutEvent,
} from '../redux/actions';
import { shuffleCodeblocks } from '../utils/shuffleCodeblocks/shuffleCodeblocks';
import Lobby from '../components/Lobby/Lobby';

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
  listShoutEvent: state.listShoutEvent,
  fieldShoutEvent: state.fieldShoutEvent,
  newTaskShoutEvent: state.newTaskShoutEvent,
  clearShoutEvent: state.clearShoutEvent,
  inProgress: state.inProgress,
});
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setListState: (...args) => dispatch(setListState(...args)),
    dispatch_setFieldState: (...args) => dispatch(setFieldState(...args)),
    dispatch_startGame: (...args) => dispatch(startGame(...args)),
    dispatch_listShoutEvent: (...args) => dispatch(listShoutEvent(...args)),
  };
}

/**
 * Listens to changes in the redux store and sends new messages to all peers.
 */
class CommunicationListener extends Component {
  /**
   * Shouts when the state changes
   *
   * @param {*} prevProps : Checks that the new value is different
   */
  /**
   * Distribute cards to all players, including yourself
   */
  initialize_board() {
    // Read task information from redux store
    const state = store.getState();
    const currentTask = state.currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];
    let solutionField = currentTaskObject.solutionField.field;
    let handList = currentTaskObject.handList;

    // initalize solutionfield
    const { dispatch_setFieldState } = this.props;
    dispatch_setFieldState(solutionField);

    // shuffle codeblocks
    let codeblocks = shuffleCodeblocks(
      handList.correct,
      handList.distractors,
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

  componentDidUpdate(prevProps) {
    const state = store.getState();
    console.log('How many peers in listener: ' + this.props.webrtc.getPeers());

    if (prevProps.listShoutEvent !== this.props.listShoutEvent) {
      // This peer moved codeblock in an handlist, notify other peers
      console.log('component did update', 'handlist');
      const json = JSON.stringify(state.handList);
      this.props.webrtc.shout(SET_LIST, json);
    } else if (prevProps.fieldShoutEvent !== this.props.fieldShoutEvent) {
      // This peer moved codeblock in soloutionfield, notify other peers
      console.log('component solutionfield did update', 'solution field');
      const json = JSON.stringify(state.solutionField);
      this.props.webrtc.shout(SET_FIELD, json);
    } else if (
      // This peer updated the game state by going to the next task
      prevProps.newTaskShoutEvent !== this.props.newTaskShoutEvent
    ) {
      console.log('new task');
      this.initialize_board();
      const json = JSON.stringify(state.currentTask);
      this.props.webrtc.shout(NEXT_TASK, json);
      const { dispatch_listShoutEvent } = this.props;
      dispatch_listShoutEvent(state.handList);
    } else if (prevProps.clearShoutEvent !== this.props.clearShoutEvent) {
      console.log('board reset');
      const json = JSON.stringify({
        currentTask: state.currentTask,
        handList: state.handList,
      });
      this.props.webrtc.shout(CLEAR_TASK, json);
    } else if (prevProps.inProgress !== this.props.inProgress) {
      console.log('game started');
      const json = JSON.stringify({
        inProgress: state.inProgress,
        handList: state.handList,
      });
      this.props.webrtc.shout(START_GAME, json);
    }
  }

  render() {
    return (
      <>
        {store.getState().inProgress ? (
          <App />
        ) : (
          <Lobby handleClick={() => this.start()} />
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebRTC(CommunicationListener));
