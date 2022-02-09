import React from 'react';
import SidebarButton from '../../components/Game/Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../utils/images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import { useState } from 'react';
import CommunicationHandler from './webrtc/CommunicationHandler';

export default function JoinGame() {
  const [nick, setNick] = useState('');
  const [ready, setReady] = useState(false);

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

  return (
    <>
      {ready ? (
        <CommunicationHandler nick={nick} />
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
            <h1>Enter your nickname</h1>
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
                }}
              />
            </label>
            <div style={{ paddingTop: '1.5em' }}>
              <SidebarButton
                title='Join game'
                icon={SubmitIcon}
                color={COLORS.lightgreen}
                handleClick={handleSubmit}
                width='9em'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
