import React, { Component, useEffect, useState } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { connect } from 'react-redux';
import store from '../redux/store/store';
import App from '../App';
import { NEW_COUNT, SET_LIST, SET_FIELD, NEXT_TASK } from './messages';

/**
 * Helper function to retrive data from the redux store.
 *
 * @param {*} state : Redux store
 * @returns
 */
const mapStateToProps = (state) => ({
  counter: state.counter, // update from counter to game state later (now gets it form reduxers/index.js)
  handList: state.handList,
  solutionField: state.solutionField,
  currentTask: state.currentTask,
});

/**
 * Listens to changes in the redux store and sends new messages to all peers.
 */
class CommunicationListener extends Component {
  /**
   * Shouts when the state changes
   *
   * @param {*} prevProps : Checks that the new counter value is different
   */
  componentDidUpdate(prevProps) {
    const state = store.getState();

    if (prevProps.counter !== this.props.counter) {
      this.props.webrtc.shout(NEW_COUNT, state.counter);
    } else if (prevProps.handList !== this.props.handList) {
      console.log('component did update', 'handlist');
      const json = JSON.stringify(state.handList);
      this.props.webrtc.shout(SET_LIST, json);
    } else if (prevProps.solutionField !== this.props.solutionField) {
      console.log('component solutionfield did update', 'solution field');
      const json = JSON.stringify(state.solutionField);
      this.props.webrtc.shout(SET_FIELD, json);
    } else if (
      prevProps.currentTask.currentTaskNumber !==
      this.props.currentTask.currentTaskNumber
    ) {
      console.log('new task');
      const json = JSON.stringify(state.currentTask);
      this.props.webrtc.shout(NEXT_TASK, json);
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
