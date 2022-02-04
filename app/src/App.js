import './App.css';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby/Lobby';
import Finished from './components/Finished/Finished';
import { STATUS } from './utils/constants';
import { useSelector } from 'react-redux';

/**
 * Shows the lobby, the game or the finished page.
 */
function App({ startGame }) {
  const status = useSelector((state) => state.status);
  document.title = 'Code puzzle';

  /**
   * Get the correct component based on the status
   * @param {Number} status status of the game
   * @returns the correct component based on status
   */
  const getPage = (status) => {
    if (status === STATUS.LOBBY) return <Lobby handleClick={startGame} />;
    else if (status === STATUS.GAME) return <MainPage />;
    else if (status === STATUS.FINISHED) return <Finished />;
  };

  return getPage(status);
}

export default App;
