import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import {
  increment,
  decrement,
  setListState,
  setFieldState,
  nextTask,
  setPeers,
  addPeer,
  removePeer,
} from '../redux/actions';
import { NEW_COUNT, SET_LIST, SET_FIELD, NEXT_TASK } from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../utils/compareArrays/compareArrays';

/**
 * Helper function to let us call dispatch from a class function
 */
const mapStateToProps = null;
function mapDispatchToProps(dispatch) {
  return {
    dispatch_increment: (...args) => dispatch(increment(...args)),
    dispatch_decrement: (...args) => dispatch(decrement(...args)),
    dispatch_setList: (...args) => dispatch(setListState(...args)),
    dispatch_setField: (...args) => dispatch(setFieldState(...args)),
    dispatch_nextTask: (...args) => dispatch(nextTask(...args)),
    dispatch_setPeers: (...args) => dispatch(setPeers(...args)),
    dispatch_addPeer: (...args) => dispatch(addPeer(...args)),
    dispatch_removePeer: (...args) => dispatch(removePeer(...args))
  };
}

/**
 * Handles all incoming communication
 */
class CommunicationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peers: [],
      connected: false
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
    //this.setState({peers: [...this.state.peers, peer.id]})
    const { dispatch_addPeer } = this.props;
    dispatch_addPeer(peer)
    console.log(`Peer-${peer.id.substring(0, 5)} joined the room!`);
    console.log("webrtc clients", webrtc.getPeers());
  };

  /**
   * Called when a new peer leaves the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about this peer
   */
  handlePeerLeft = (webrtc, peer) => {
    //this.setState({ peers: this.state.peers.filter((p) => peer.id !== p) });
    const { dispatch_removePeer } = this.props;
    dispatch_removePeer(peer)
    console.log(`Peer-${peer.id.substring(0, 5)} disconnected.`);
    console.log("webrtc clients", webrtc.getPeers());
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
      case NEW_COUNT:
        this.newCount(payload); // Another player pressed the count
        break;
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
      default:
        return;
    }
  };

  joinedRoom = (webrtc) => {
    console.log("Joined room with id: " + webrtc.getMyId(), "Other peers: "+webrtc.getPeers());
    const { dispatch_setPeers } = this.props;
    console.log("peers: " + webrtc.getPeers());
    // add YOU as a peer
    // TODO: change peers to players. this includes changing the reducers
    dispatch_setPeers([...webrtc.getPeers(), {id: 'YOU'}])  
    this.setState({connected: true})
  }

  /**
   * Temporarly function to show how the counter can work in multiplayer
   *
   * @param {*} payload : Payload send int the webrtc shout
   */
  newCount(payload) {
    console.log('incoming count change from another peer : ' + payload);
    const counter = store.getState().counter;
    const { dispatch_increment, dispatch_decrement } = this.props;

    if (payload > counter) {
      dispatch_increment(5);
    } else if (payload < counter) {
      dispatch_decrement(5);
    }
    // else counter = payload - do nothing
  }

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
        {this.state.connected ? <CommunicationListener /> : <h1>Waiting to connect...</h1>}
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
