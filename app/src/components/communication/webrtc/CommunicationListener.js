import React, { Component } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../../../redux/store/store';
import App from '../../../App';
import {
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
  FINISHED,
  MOVE_REQUEST,
  LOCK_REQUEST,
  LOCK_EVENT,
  SELECT_REQUEST,
  SELECT_EVENT,
  SET_TASKSET,
  SET_LISTS_AND_FIELD,
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
  setPlayers,
} from '../../../redux/actions';
import { shuffleCodeblocks } from '../../../utils/shuffleCodeblocks/shuffleCodeblocks';
import { STATUS } from '../../../utils/constants';
import configData from '../../../config.json';
import { LOCKTYPES } from '../../../utils/constants';
import { setAllLocks } from '../../../utils/lockHelper/lockHelper';

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
  tasksetEvent: state.tasksetEvent,
  clearEvent: state.clearEvent,
  status: state.status,
  players: state.players,
  finishEvent: state.finishEvent,
  host: state.host,
  moveRequest: state.moveRequest,
  lockRequest: state.lockRequest,
  lockEvent: state.lockEvent,
  selectRequest: state.selectRequest,
  selectEvent: state.selectEvent,
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
    dispatch_setPlayers: (...args) => dispatch(setPlayers(...args)),
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
  EVENT_DELAY = 2000;
  timer = null;

  /**
   * Checks that a block with a given id only is present once in the lists
   *
   * @param {*} state
   */
  removeDuplicates(state) {
    let blockIds = [];
    let newField = [];
    let newList = [];

    for (let block of state.solutionField) {
      if (!blockIds.includes(block.id)) {
        blockIds.push(block.id);
        newField.push(block);
      }
    }

    for (let playerList of state.handList) {
      let newPlayerList = [];
      for (let block of playerList) {
        if (!blockIds.includes(block.id)) {
          blockIds.push(block.id);
          newPlayerList.push(block);
        }
      }
      newList.push(newPlayerList);
    }

    const { dispatch_setFieldState, dispatch_setListState } = this.props;
    dispatch_setFieldState(newField);
    dispatch_setListState(newList);
  }

  /**
   * The HOST holds the correct state and synchronizes all players on a given interval
   */
  hearthbeat() {
    this.timer = setInterval(() => {
      let state = store.getState();
      if (this.iAmHost(state.host) && state.status === STATUS.GAME) {
        let now = new Date().getTime();

        // Checks that a block with a given id only is present once in the lists
        this.removeDuplicates(state);

        // If there has not been a FIELD update since last hearthbeat
        if (now - state.fieldEvent > this.EVENT_DELAY) {
          const { dispatch_fieldEvent } = this.props;
          dispatch_fieldEvent();
        }
      }
    }, this.EVENT_DELAY);
  }

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
    const json = JSON.stringify(payload);
    if (this.isProduction) {
      this.props.webrtc.broadcast(type, json);
    } else {
      this.props.webrtc.shout(type, json);
    }
  }

  /**
   * Notify a peer with whisper and the signaling server with transmit
   * @param {*} peerId
   * @param {*} type
   * @param {*} payload
   */
  whisper(peerId, type, payload) {
    const json = JSON.stringify(payload);
    const peer = this.props.webrtc.getPeerById(peerId);
    if (this.isProduction) {
      this.props.webrtc.transmit(peer, type, json);
    } else {
      this.props.webrtc.whisper(peer, type, json);
    }
  }

  /**
   * @returns true if this player is the host.
   */
  iAmHost(pid) {
    return pid === '';
  }

  /**
   * Shouts if this peer is host
   *
   * @param {*} type
   * @param {*} payload
   */
  shoutIfHost(host, type, payload) {
    if (this.iAmHost(host)) {
      this.shout(type, payload);
    }
  }

  /**
   * Clears the board state
   *
   * @param {*} state
   */
  clearBoard(state) {
    if (this.iAmHost(state.host)) {
      // This peer cleared the board
      const { dispatch_lockEvent } = this.props;
      dispatch_lockEvent({ pid: 'ALL_PLAYERS', lock: false });
      this.shout(SET_LISTS_AND_FIELD, {
        solutionField: state.solutionField,
        handList: state.handList,
      });
    } else this.whisper(state.host, CLEAR_TASK, '');
  }

  /**
   * Shout that we are going to the next task
   *
   * @param {*} state
   */
  goToNextTask(state) {
    this.initialize_board();
    const payload = {
      currentTask: state.currentTask,
      handList: state.handList,
      solutionField: state.solutionField,
    };
    this.shout(NEXT_TASK, payload);
    const { dispatch_listEvent, dispatch_setPlayers, dispatch_lockEvent } =
      this.props;
    dispatch_listEvent();

    let players = store.getState().players;
    dispatch_setPlayers(setAllLocks(players, false));
    dispatch_lockEvent({ pid: LOCKTYPES.ALL_PLAYERS, lock: false });
  }

  /**
   * Shout that we are starting the game. I became host since I started the game from the lobby
   *
   * @param {*} state
   */
  startFromLobby(state) {
    let playerIds = state.players.map((p) => p.id);

    const payload = {
      status: state.status,
      handList: state.handList,
      solutionField: state.solutionField,
      playerIds: playerIds,
      tasksetNumber: state.currentTask.selectedTaskSet,
    };
    if (state.status === STATUS.GAME) {
      this.shout(START_GAME, payload);
    }
  }

  /**
   * Start hearthbeat on mount
   */
  componentDidMount() {
    setTimeout(() => {
      this.hearthbeat();
    }, this.EVENT_DELAY * 5);
  }

  /**
   * End hearthbeat on unmount
   */
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /**
   * Notifies other peers when this player changes the state
   *
   * @param {*} prevProps : Checks that the new value is different
   */
  componentDidUpdate(prevProps) {
    const state = store.getState();

    switch (true) {
      case prevProps.selectEvent !== this.props.selectEvent: // New block selected
        this.shoutIfHost(state.host, SELECT_EVENT, state.selectEvent);
        break;
      case prevProps.selectRequest !== this.props.selectRequest: // I want to select a new block
        this.whisper(state.host, SELECT_REQUEST, state.selectRequest);
        break;
      case prevProps.moveRequest !== this.props.moveRequest: // I want to move a block
        this.whisper(state.host, MOVE_REQUEST, state.moveRequest);
        break;
      case prevProps.fieldEvent !== this.props.fieldEvent ||
        prevProps.listEvent !== this.props.listEvent: // Block moved in field or list
        this.shout(SET_LISTS_AND_FIELD, {
          solutionField: state.solutionField,
          handList: state.handList,
        });
        break;
      case prevProps.clearEvent.getTime() < this.props.clearEvent.getTime(): // I cleared the board
        this.clearBoard(state);
        break;
      case prevProps.lockRequest !== this.props.lockRequest: // I want to lock the board
        this.whisper(state.host, LOCK_REQUEST, state.lockRequest);
        break;
      case prevProps.lockEvent !== this.props.lockEvent: // Board locked
        this.shoutIfHost(state.host, LOCK_EVENT, state.lockEvent);
        break;
      case prevProps.taskEvent !== this.props.taskEvent: // New task
        this.goToNextTask(state);
        break;
      case prevProps.tasksetEvent !== this.props.tasksetEvent: // New taskset
        this.shout(SET_TASKSET, state.currentTask.selectedTaskSet);
        break;
      case prevProps.status !== this.props.status: // I started this game from the lobby
        this.startFromLobby(state);
        break;
      case prevProps.finishEvent !== this.props.finishEvent: // We solved the puzzles :)
        this.shout(FINISHED, '');
        break;
      default:
        break;
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
