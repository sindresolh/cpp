import React from 'react';
import SidebarButton from '../Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import store from '../../redux/store/store';
import './Lobby.css';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  return { players: state.players };
}

function Lobby({ handleClick }) {
  const players = store.getState().players;
  console.log(players);
  return (
    <div className='Lobby'>
      <h1>Lobby</h1>
      <ul className='playerList'>
        {players.map((player) => {
          return (
            <li key={player.id}>
              {player.id === 'YOU' ? player.id : player.nick}
            </li>
          );
        })}
      </ul>
      <div>
        <SidebarButton
          title='Start game'
          icon={SubmitIcon}
          color={COLORS.lightgreen}
          handleClick={handleClick}
          width='9em'
        />
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(Lobby);
