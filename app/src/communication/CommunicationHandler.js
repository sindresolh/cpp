import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import { increment, decrement } from '../redux/actions';

/**
 * Helper function to let us call dispatch from a class function
 */
const mapStateToProps = null;
function mapDispatchToProps(dispatch) {
  return {
    dispatch_increment: (...args) => dispatch(increment(...args)),
    dispatch_decrement: (...args) => dispatch(decrement(...args)),
  };
}

/**
 * Handles all incoming communication
 */
class CommunicationHandler extends Component {
  /**
   * Adds a new client to the room
   *
   * @param {*} webrtc : : Keeps information about the room
   * @returns
   */
  join = (webrtc) => webrtc.joinRoom('cpp-room');

  /**
   * Called when a new peer is added to the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about this peer
   */
  handleCreatedPeer = (webrtc, peer) => {
    console.log(`Peer-${peer.id.substring(0, 5)} joined the room!`);
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
      case 'new count':
        this.newCount(payload); // Another player pressed the count
        break;
      default:
        return;
    }
  };

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

  render() {
    return (
      <LioWebRTC
        options={{ dataOnly: true }}
        onReady={this.join}
        onCreatedPeer={this.handleCreatedPeer}
        onReceivedPeerData={this.handlePeerData}
        onRemovedPeer={this.handlePeerLeft}
      >
        <CommunicationListener />
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
