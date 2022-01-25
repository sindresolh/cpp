import React from 'react';
import SidebarButton from '../Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import store from '../../redux/store/store';

function Lobby({ handleClick }) {
  const players = store.getState().players;
  return (
    <div style={{ position: 'absolute', top: '10%', left: '20%' }}>
      <h1>Lobby</h1>
      <ul>
        {players.map((player) => {
          return <li>{player.id}</li>;
        })}
      </ul>
      <SidebarButton
        title='Start game'
        icon={SubmitIcon}
        color={COLORS.lightgreen}
        handleClick={handleClick}
        width='9em'
      />
    </div>
  );
}

export default Lobby;
