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
} from '../redux/actions';
import { SET_LIST, SET_FIELD, NEXT_TASK, CLEAR_TASK } from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../utils/compareArrays/compareArrays';
import { PLAYER } from '../utils/constants';

/**
 * Helper function to let us call dispatch from a class function
 */
const mapStateToProps = null;
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setList: (...args) => dispatch(setListState(...args)),
    dispatch_setField: (...args) => dispatch(setFieldState(...args)),
    dispatch_nextTask: (...args) => dispatch(nextTask(...args)),
    dispatch_setPlayers: (...args) => dispatch(setPlayers(...args)),
    dispatch_addPlayer: (...args) => dispatch(addPlayer(...args)),
    dispatch_removePlayer: (...args) => dispatch(removePlayer(...args)),
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
    const { dispatch_setList } = this.props;
    const prevState = store.getState().handList;
    const payloadState = JSON.parse(payload);
    if (!twoDimensionalArrayIsEqual(prevState, payloadState)) {
      dispatch_setList(payloadState);
    }
  }

  /**
   *  Update the blocks in the solution field.
   *
   * @param {*} payload the new state for solution field
   */
  setField(payload) {
    console.log('incoming set field from another peer : ' + payload);
    const { dispatch_setField } = this.props;
    const prevState = store.getState().solutionField;
    const payloadState = JSON.parse(payload);

    if (!arrayIsEqual(prevState, payloadState)) {
      dispatch_setField(payloadState);
    }
  }

  /**
   * Update the current task
   *
   * @param {*} payload new task
   */
  nextTask(payload) {
    console.log('another player has changed the current task : ' + payload);
    const { dispatch_nextTask } = this.props;
    const prevState = store.getState().currentTask;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState) {
      dispatch_nextTask(payloadState);
    }
  }

  /**
   * Clears the board
   *
   * @param {*} payload : Payload sent int the webrtc shout
   */
  clearTask(payload) {
    console.log('incoming board clear from another peer : ' + payload);

    const currentTask = store.getState().currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];

    const { dispatch_setField } = this.props;
    dispatch_setField(currentTaskObject.solutionField.field);

    const { dispatch_setList } = this.props;
    dispatch_setList(currentTaskObject.handList.player1, PLAYER.P1 - 1);
    dispatch_setList(currentTaskObject.handList.player2, PLAYER.P2 - 1);
    dispatch_setList(currentTaskObject.handList.player3, PLAYER.P3 - 1);
    dispatch_setList(currentTaskObject.handList.player4, PLAYER.P4 - 1);
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
