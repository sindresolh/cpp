import React, { Component, useEffect, useState } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../redux/store/store';
import App from '../App';

/**
 * Helper function to retrive data from the redux store.
 *
 * @param {*} state : Redux store
 * @returns
 */
const mapStateToProps = (state) => ({
  counter: state.counter, // update from counter to game state later (now gets it form reduxers/index.js)
});

/**
 * Listens to changes in the redux store and sends new messages to all peers.
 */
class CommunicationListener extends Component {
  /**
   * Shouts when the counter changes
   *
   * @param {*} prevProps : Checks that the new counter value is different
   */
  componentDidUpdate(prevProps) {
    if (prevProps.counter !== this.props.counter) {
      console.log('component did update');
      const state = store.getState();
      this.props.webrtc.shout('new count', state.counter);
    }
  }

  render() {
    return (
      <>
        <App />
      </>
    );
  }
}

export default connect(mapStateToProps)(withWebRTC(CommunicationListener));
