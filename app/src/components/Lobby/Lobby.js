import React, { useEffect, useState } from 'react';
import SidebarButton from '../Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';
import './Lobby.css';
import { useSelector } from 'react-redux';
import PuzzleGif from './PuzzleGif';

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/** Show the players in the lobby based on their nickname
 *
 * @param {*} param0
 * @returns
 */
function Lobby({ handleClick, peers }) {
  const players = useSelector((state) => state.players);
  const [data, setData] = useState(false);

  useEffect(() => {
    setData(false);
    let unmounted = false;
    sleep(500)
      .then(() => !unmounted && setData(true))
      .catch(console.error);
    return () => (unmounted = true);
  }, [players]);

  return (
    <div className='Lobby'>
      <h1>Lobby</h1>
      <ul className='playerList'>
        {players.map((player) => {
          return <li key={player.id}>{player.nick}</li>;
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
