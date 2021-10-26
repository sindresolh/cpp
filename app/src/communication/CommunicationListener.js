import React, { Component, useEffect, useState } from 'react';
import { withWebRTC } from 'react-liowebrtc';
import { useDispatch } from 'react-redux';
import { getNumber } from '../redux/actions';

import App from '../App';
import Counter from '../redux/testcomponents/counterComponent';

/*
  Listens for incoming channel events
*/
const Listener = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('funker dette?');
    //dispatch(getRecentSheets());
  }, [dispatch]);

  return (
    <>
      {/* <App /> */}
      <Counter />
    </>
  );
};

/**
 * Wrapper for the function Listener. WebRTC require classes and useEffect requires a function.
 */
class CommunicationListener extends Component {
  handleClick = () => {
    console.log('button clicked');
    this.props.webrtc.shout('event-label', 'payload');
  };

  render() {
    return (
      <>
        <Listener />
      </>
    );
  }
}

export default withWebRTC(CommunicationListener);
