import './App.css';
import MainPage from './components/state/MainPage/MainPage';
import Lobby from './components/state/Lobby/Lobby';
import Finished from './components/state/Finished/Finished';
import { STATUS } from './utils/constants';
import { useSelector } from 'react-redux';
import { memo } from 'react';

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
    switch (status) {
      case STATUS.LOBBY:
        return <Lobby handleClick={startGame} />;
      case STATUS.GAME:
        return <MainPage />;
      case STATUS.FINISHED:
        return <Finished />;
    }
  };

  return getPage(status);
}

export default memo(App);
