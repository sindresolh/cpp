import React from 'react';
import SidebarButton from '../../components/Game/Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../utils/images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import { useState } from 'react';
import CommunicationHandler from './webrtc/CommunicationHandler';

const ROOMS = ['Room-1', 'Room-2', 'Room-3', 'Room-4', 'Room-5'];

export default function JoinGame() {
  const [nick, setNick] = useState('');
  const [ready, setReady] = useState(false);
  const [room, setRoom] = useState(ROOMS[0]);

  /**
   * Join game with buttonclick or enter
   */
  const handleSubmit = () => {
    setReady(true);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  /** Set room */
  const handleChange = (event) => {
    setRoom(event.target.value);
  };

  return (
    <>
      {ready ? (
        <CommunicationHandler nick={nick} room={room} />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: COLORS.background,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: COLORS.solutionfield,
              marginTop: '10em',
              width: '50em',
              height: '25em',
              alignContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5em',
            }}
          >
            <h1 style={{ fontSize: 'calc(18px + 0.4vw)' }}>
              Enter your nickname
            </h1>
            <label style={{ background: ' none' }}>
              <input
                onKeyDown={handleKeyDown}
                type='text'
                name={nick}
                onChange={(e) => setNick(e.target.value)}
                style={{
                  marginTop: '2em',
                  transform: 'scale(1.5)',
                  borderRadius: '0.5em',
                  borderColor: 'black',
                  background: '#fafafa',
                  width: '8vw',
                }}
              />
            </label>
            <h2 style={{ fontSize: 'calc(12px + 0.4vw)', marginTop: '3em' }}>
              Select a game lobby
            </h2>
            <select value={room} onChange={handleChange}>
              {ROOMS.map((room) => (
                <option value={room}>{room}</option>
              ))}
            </select>
            <div style={{ paddingTop: '1.5em' }}>
              <SidebarButton
                title='Join game'
                icon={SubmitIcon}
                color={COLORS.lightgreen}
                handleClick={handleSubmit}
                width='8em'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
