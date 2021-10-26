import React, { Component, useEffect, useState } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';

import App from '../App';
import Counter from '../redux/testcomponents/counterComponent';

/**
 * Listens to changes in the redux store
 *
 * @param {*} state : Redux store
 * @returns
 */
const mapStateToProps = (state) => ({
  counter: state.counter, // update from counter to game state later
});

/**
 * Listens to changes in the state and sends new shout events
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
      this.props.webrtc.shout('new count', 'a new count event');
    }
  }

  render() {
    return (
      <>
        {/* <App /> */}
        <Counter />
      </>
    );
  }
}

export default connect(mapStateToProps)(withWebRTC(CommunicationListener));
