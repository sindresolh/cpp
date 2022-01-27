import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import {
  setListState,
  setFieldState,
  nextTask,
  setPlayers,
  addPlayer,
  removePlayer,
  startGame,
} from '../redux/actions';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
} from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../utils/compareArrays/compareArrays';
import { clearBoard } from '../utils/shuffleCodeblocks/shuffleCodeblocks';
import PuzzleGif from '../components/Lobby/PuzzleGif';

const mapStateToProps = null;

/** Helper function to let us call dispatch from a class function
 *
 * @param {*} dispatch
 * @returns
 */
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setListState: (...args) => dispatch(setListState(...args)),
    dispatch_setFieldState: (...args) => dispatch(setFieldState(...args)),
    dispatch_nextTask: (...args) => dispatch(nextTask(...args)),
    dispatch_setPlayers: (...args) => dispatch(setPlayers(...args)),
    dispatch_addPlayer: (...args) => dispatch(addPlayer(...args)),
    dispatch_removePlayer: (...args) => dispatch(removePlayer(...args)),
    dispatch_startGame: (...args) => dispatch(startGame(...args)),
  };
}

/**
 * Handles all incoming communication.
 */
class CommunicationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      connected: false,
    };
  }
  /**
   * Adds a new client to the room
   *
   * @param {*} webrtc : : Keeps information about the room
   * @returns
   */
  join = (webrtc) => webrtc.joinRoom('cpp-room1');

  /**
   * Called when a new peer is added to the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about this peer
   */
  handleCreatedPeer = (webrtc, peer) => {
    const { dispatch_addPlayer } = this.props;
    dispatch_addPlayer(peer);
    console.log(`Peer-${peer.id.substring(0, 5)} joined the room!`);
  };

  /**
   * Called when a new peer leaves the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about this peer
   */
  handlePeerLeft = (webrtc, peer) => {
    const { dispatch_removePlayer } = this.props;
    dispatch_removePlayer(peer);
    console.log(`Peer-${peer.id.substring(0, 5)} disconnected.`);
  };

  /** Called when a new peer successfully joins the room
   *
   * @param {*} webrtc : Keeps information about the room
   */
  joinedRoom = (webrtc) => {
    const { dispatch_setPlayers } = this.props;
    dispatch_setPlayers([...webrtc.getPeers(), { id: 'YOU' }]);
    this.setState({ connected: true });
  };

  /**
   * Called when another peer in the room calls: webrtc.shout
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} type : The type of event that was called
   * @param {*} payload : Receiving data
   * @param {*} peer : Keeps information about this peer
   */
  handlePeerData = (webrtc, type, payload, peer) => {
    switch (type) {
      case SET_LIST:
        this.setList(payload);
        break;
      case SET_FIELD:
        this.setField(payload);
        break;
      case NEXT_TASK:
        this.nextTask(payload);
        break;
      case CLEAR_TASK:
        this.clearTask();
        break;
      case START_GAME:
        this.startGame(payload);
        break;
      default:
        return;
    }
  };

  /**
   *  Update the blocks in a hand list.
   *
   * @param {*} payload the new state for hand list
   */
  setList(payload) {
    const { dispatch_setListState } = this.props;
    const prevState = store.getState().handList;
    const payloadState = JSON.parse(payload);

    if (!twoDimensionalArrayIsEqual(prevState, payloadState)) {
      dispatch_setListState(payloadState);
    }
  }

  /**
   *  Update the blocks in the solution field.
   *
   * @param {*} payload the new state for solution field
   */
  setField(payload) {
    const { dispatch_setFieldState } = this.props;
    const prevState = store.getState().solutionField;
    const payloadState = JSON.parse(payload);

    if (!arrayIsEqual(prevState, payloadState)) {
      dispatch_setFieldState(payloadState);
    }
  }

  /**
   * Get the initial solution field from file
   */
  initialFieldFromFile() {
    let currentTask = store.getState().currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];
    let initialfield = currentTaskObject.solutionField.field;
    const { dispatch_setFieldState } = this.props;
    dispatch_setFieldState(initialfield);
  }

  /**
   * Update the current task
   *
   * @param {*} payload new task
   */
  nextTask(payload) {
    const prevState = store.getState().currentTask;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.currentTask) {
      const { dispatch_nextTask } = this.props;
      dispatch_nextTask();
      this.initialFieldFromFile();
    }
  }

  /**
   * Clears the board
   */
  clearTask() {
    // Get current board state
    let field = store.getState().solutionField;
    let handList = store.getState().handList;

    // Update board
    handList = clearBoard(field, handList);
    const { dispatch_setListState } = this.props;
    dispatch_setListState(handList);
    this.initialFieldFromFile();
  }

  /** Another player started the game from the lobby
   *
   * @param {*} payload
   */
  startGame(payload) {
    const prevState = store.getState().inProgress;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.inProgress) {
      const { dispatch_setListState } = this.props;
      dispatch_setListState(payloadState.handList);

      const { dispatch_setFieldState } = this.props;
      dispatch_setFieldState(payloadState.solutionField);

      const { dispatch_startGame } = this.props;
      dispatch_startGame();
    }
  }

  render() {
    return (
      <LioWebRTC
        options={{ dataOnly: true }}
        onReady={this.join}
        onCreatedPeer={this.handleCreatedPeer}
        onReceivedPeerData={this.handlePeerData}
        onRemovedPeer={this.handlePeerLeft}
        onJoinedRoom={this.joinedRoom}
      >
        {this.state.connected ? <CommunicationListener /> : <PuzzleGif />}
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
