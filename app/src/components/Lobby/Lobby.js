import React from 'react';
import SidebarButton from '../Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import './Lobby.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';

/** Show the players in the lobby based on their nickname
 *
 * @param {*} param0
 * @returns
 */
function Lobby({ handleClick, peers }) {
  const players = useSelector((state) => state.players);

  // Se på dette tullet her. Players har nick, men ikke p
  // Bytt ut med peers (prop.webrtc.getPeers()) og jeg har det samme problemet
  console.log(players);
  for (var p of players) console.log(p.nick);

  return (
    <div className='Lobby'>
      <h1>Lobby</h1>
      <ul className='playerList'>
        {players.map((player) => {
          return <li key={player.id}>{player.id}</li>;
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

export default Lobby;
