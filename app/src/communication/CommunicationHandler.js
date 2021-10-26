import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';

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
      case 'new count': // Another player pressed the count
        console.log('incoming count change from another peer');
        break;
      default:
        return;
    }
  };

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

export default CommunicationHandler;
