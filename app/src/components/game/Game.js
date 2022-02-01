import './Game.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SolutionField from '../SolutionField/SolutionField';
import Sidebar from '../Sidebar/Sidebar';
import { PLAYER } from '../../utils/constants';
import Player from '../Player/Player';
import { useSelector } from 'react-redux';
import { COLORS } from '../../utils/constants';
import playerReducer from '../../redux/reducers/gameState/players';

export default function Game() {
  const players = useSelector((state) => state.players);

  /** Set the name of the players.
   *
   * @param {*} players : redux stored information about the players
   * @returns
   */
  const setNames = (players) => {
    let names = [
      'Not connected',
      'Not connected',
      'Not connected',
      'Not connected',
    ];
    for (let player = 0; player < players.length; player++) {
      names[player] =
        players[player].id === 'YOU'
          ? players[player].id
          : players[player].nick;
    }
    // Lastly add this client's name
    return names;
  };

  let names = setNames(players);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className='Game'
        data-testid='Game'
        style={{ background: COLORS.background }}
      >
        {/*Player 1 and 3 on the left side*/}
        <div className='GameLeft'>
          <Player playerNo={PLAYER.P1} name={names[0]} />
          <Player playerNo={PLAYER.P3} name={names[2]} />
        </div>

        {/*Middle : Soloutionfield and Sidebar*/}
        <div className='GameCenter'>
          <SolutionField />
          <Sidebar />
        </div>

        {/*Player 2 and 4 on the right side*/}
        <div className='GameRight'>
          <Player playerNo={PLAYER.P2} name={names[1]} />
          <Player playerNo={PLAYER.P4} name={names[3]} />
        </div>
      </div>
    </DndProvider>
  );
}
