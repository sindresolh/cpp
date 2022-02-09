import React, { useEffect, useState } from 'react';
import SidebarButton from '../../Game/Sidebar/SidebarButton/SidebarButton';
import SubmitIcon from '../../../utils/images//buttonIcons/submit.png';
import { COLORS } from '../../../utils/constants';
import './Lobby.css';
import { useSelector } from 'react-redux';
import PlayerIcon from '../../../utils/images/playerIcons/player_icon.png';

/** Show the players in the lobby based on their nickname
 *
 * @param {*} param0
 * @returns
 */
function Lobby({ handleClick }) {
  const players = useSelector((state) => state.players);
  const [data, setData] = useState(false);

  /** Recursive busy wait untill a given player has a nick property
   *
   * @param {*} p : player object
   * @returns
   */
  const hasNick = (p) => {
    return new Promise(function (resolve) {
      (function waitForNick() {
        if (p.hasOwnProperty('nick')) {
          if (!p.nick) {
            p.nick = p.id.substring(0, 5);
          }
          return resolve(); // Resolve if nick is present
        }
        setTimeout(waitForNick, 30); // Wait 30 ms and check again
      })();
    });
  };

  /** Checks that player.nick is set for all players
   *
   * @returns
   */
  const ensureAllNicksAreSet = () => {
    const promises = [];

    // Checks that each individual player has player.nick
    for (let p of players) {
      promises.push(hasNick(p));
    }

    // Return all resolved promises
    return Promise.all(promises);
  };

  /** Rerender after ensuring that all players have their nicks present
   *
   */
  useEffect(() => {
    setData(false);
    let unmounted = false;
    ensureAllNicksAreSet()
      .then(() => !unmounted && setData(true))
      .catch(console.error);
    return () => (unmounted = true);
  }, [players]);

  return (
    <div
      style={{
        background: COLORS.background,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className='Lobby' style={{ background: COLORS.solutionfield }}>
        <h1>Lobby</h1>
        <ul className='playerList'>
          {players.map((player) => {
            return (
              <li key={player.id}>
                {player.nick !== null && player.nick !== undefined ? (
                  <div>
                    {' '}
                    <img
                      src={PlayerIcon}
                      style={{ height: '6em', alt: 'player icon' }}
                    />
                    <p style={{ marginLeft: '2em' }}>{player.nick}</p>
                  </div>
                ) : (
                  '' // Do not render anything if nick is undefined
                )}
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
            disabled={!data} // Disable if data is not loaded
          />
        </div>
      </div>
    </div>
  );
}

export default Lobby;
