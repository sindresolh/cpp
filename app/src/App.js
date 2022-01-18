import './App.css';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby/Lobby';
import store from './redux/store/store';
import { useSelector, useDispatch } from 'react-redux';
import { startGame, setList } from './redux/actions';
import { PLAYER } from './utils/constants';
import { shuffleCodeblocks } from './utils/shuffleCodeblocks/shuffleCodeblocks';

/**
 * Shows a lobby or the game based on wheter or not someone started the game from the lobby
 *
 * @returns
 */
function App() {
  const dispatch = useDispatch();
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];

  const start = () => {
    // shuffle codeblocks
    let codeblocks = currentTaskObject.handList.player1.concat(
      currentTaskObject.handList.player2,
      currentTaskObject.handList.player3,
      currentTaskObject.handList.player4
    );
    codeblocks = shuffleCodeblocks(codeblocks, [], 4);

    dispatch(setList(codeblocks[PLAYER.P1 - 1], PLAYER.P1 - 1));
    dispatch(setList(codeblocks[PLAYER.P2 - 1], PLAYER.P2 - 1));
    dispatch(setList(codeblocks[PLAYER.P3 - 1], PLAYER.P3 - 1));
    dispatch(setList(codeblocks[PLAYER.P4 - 1], PLAYER.P4 - 1));

    dispatch(startGame());
  };

  return (
    <>
      {store.getState().inProgress ? (
        <MainPage />
      ) : (
        <Lobby handleClick={() => start()} />
      )}
    </>
  );
}

export default App;
