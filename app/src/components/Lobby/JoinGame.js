import React from 'react';
import SidebarButton from '../Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import { useState } from 'react';
import CommunicationHandler from '../../communication/CommunicationHandler';

export default function JoinGame() {
  const [nick, setNick] = useState('');
  const [ready, setReady] = useState(false);

  const handleSubmit = () => {
    setReady(true);
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
            zoom: 1.1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '40%',
              background: COLORS.backgroundChild,
            }}
          >
            <label style={{ background: ' none' }}>
              Nickname :
              <input
                type='text'
                name={nick}
                onChange={(e) => setNick(e.target.value)}
                style={{ margin: '1em', background: COLORS.solutionfield }}
              />
            </label>
            <div style={{ paddingTop: '3em' }}>
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
