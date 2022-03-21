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
  MOVE_REQUEST,
  LOCK_REQUEST,
  LOCK_EVENT,
} from './messages';
import {
  startGame,
  setListState,
  setFieldState,
  listEvent,
  fieldEvent,
  finishEvent,
  setHost,
  lockEvent,
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
  host: state.host,
  moveRequest: state.moveRequest,
  lockRequest: state.lockRequest,
  lockEvent: state.lockEvent,
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
    dispatch_setHost: (...args) => dispatch(setHost(...args)),
    dispatch_lockEvent: (...args) => dispatch(lockEvent(...args)),
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
  EVENT_DELAY = 0;

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

    // initialize handLists for the current task
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
   * Notify a peer with whisper and the signaling server with transmit
   * @param {*} peerId
   * @param {*} type
   * @param {*} payload
   */
  whisper(peerId, type, payload) {
    const peer = this.props.webrtc.getPeerById(peerId);
    if (this.isProduction) {
      this.props.webrtc.transmit(peer, type, payload);
    } else {
      this.props.webrtc.whisper(peer, type, payload);
    }
  }

  /**
   * @returns true if this player is the host.
   */
  iAmHost() {
    return store.getState().host === '';
  }

  /**
   * Notifies other peers when this player changes the state
   *
   * @param {*} prevProps : Checks that the new value is different
   */
  componentDidUpdate(prevProps) {
    const state = store.getState();

    if (prevProps.listEvent !== this.props.listEvent) {
      console.log('update all players about LIST event');
      // This peer moved codeblock in an handlist
      const json = JSON.stringify({
        handList: state.handList,
      });
      this.shout(SET_LIST, json);
    } else if (prevProps.fieldEvent !== this.props.fieldEvent) {
      console.log('update all players about FIELD event');
      // This peer moved codeblock in soloutionfield
      const json = JSON.stringify(state.solutionField);
      this.shout(SET_FIELD, json);
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
      if (this.iAmHost()) {
        let json = JSON.stringify(state.lockEvent);
        this.shout(LOCK_EVENT, json);

        // This peer cleared the board
        console.log('update all players about FIELD and LIST event');
        json = JSON.stringify({
          handList: state.handList,
        });
        this.shout(SET_LIST, json);
        json = JSON.stringify(state.solutionField);
        this.shout(SET_FIELD, json);
      } else this.whisper(state.host, CLEAR_TASK, '');
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
    } else if (prevProps.moveRequest !== this.props.moveRequest) {
      const json = JSON.stringify(state.moveRequest);
      this.whisper(state.host, MOVE_REQUEST, json);
    } else if (prevProps.lockRequest !== this.props.lockRequest) {
      // I am not host and need to request a lock board for myself
      const json = JSON.stringify(state.lockRequest);
      this.whisper(state.host, LOCK_REQUEST, json);
    } else if (prevProps.lockEvent !== this.props.lockEvent) {
      // A new player has changed their ready status - See Sidebar.js
      if (this.iAmHost()) {
        // I am host and I just approved a lock.
        const json = JSON.stringify(state.lockEvent);
        this.shout(LOCK_EVENT, json);
      }
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
