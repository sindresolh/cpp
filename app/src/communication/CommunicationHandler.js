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
import { PLAYER } from '../utils/constants';
import { clearBoard } from '../utils/shuffleCodeblocks/shuffleCodeblocks';

/**
 * Helper function to let us call dispatch from a class function
 */
const mapStateToProps = null;
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
 * Handles all incoming communication
 */
class CommunicationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      connected: false,
      clearedBoard: [],
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
    //this.setState({players: [...this.state.players, peer.id]})
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
    //this.setState({ players: this.state.players.filter((p) => peer.id !== p) });
    const { dispatch_removePlayer } = this.props;
    dispatch_removePlayer(peer);
    console.log(`Peer-${peer.id.substring(0, 5)} disconnected.`);
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
        console.log('next task');
        this.nextTask(payload);
        break;
      case CLEAR_TASK:
        this.clearTask(payload);
        break;
      case START_GAME:
        this.startGame(payload);
        break;
      default:
        return;
    }
  };

  joinedRoom = (webrtc) => {
    const { dispatch_setPlayers } = this.props;
    dispatch_setPlayers([...webrtc.getPeers(), { id: 'YOU' }]);
    this.setState({ connected: true });
  };

  /**
   *  Update the blocks in a hand list.
   *
   * @param {*} payload the new state for hand list
   */
  setList(payload) {
    console.log('incoming set list from another peer : ' + payload);
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
    console.log('incoming set field from another peer : ' + payload);
    const { dispatch_setFieldState } = this.props;
    const prevState = store.getState().solutionField;
    const payloadState = JSON.parse(payload);

    if (!arrayIsEqual(prevState, payloadState)) {
      dispatch_setFieldState(payloadState);
    }
  }

  /**
   * Update the current task
   *
   * @param {*} payload new task
   */
  nextTask(payload) {
    console.log('another player has changed the current task : ' + payload);
    const prevState = store.getState().currentTask;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState) {
      const { dispatch_nextTask } = this.props;
      dispatch_nextTask();
    }
  }

  /**
   * Clears the board
   *
   * @param {*} payload : Payload sent int the webrtc shout
   */
  clearTask(payload) {
    console.log('incoming board clear from another peer : ' + payload);

    // Get the initial solution field from file
    let currentTask = store.getState().currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];
    let initialfield = currentTaskObject.solutionField.field;

    // Get current board state
    let field = store.getState().solutionField;
    let handList = store.getState().handList;

    // Update board

    handList = clearBoard(field, handList);

    const { dispatch_setFieldState } = this.props;
    dispatch_setFieldState([]); // TODO: Assign unnasigned player properties to intial board.
  }

  startGame(payload) {
    console.log('Another game iniatated the start of a new game');

    const prevState = store.getState().inProgress;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.inProgress) {
      const { dispatch_startGame } = this.props;
      dispatch_startGame();

      const { dispatch_setListState } = this.props;
      dispatch_setListState(payloadState.handList);
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
        {this.state.connected ? (
          <CommunicationListener />
        ) : (
          <h1>Waiting to connect</h1>
        )}
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
