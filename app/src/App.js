import './App.css';
import MainPage from './components/MainPage';
import Lobby from './components/Lobby/Lobby';
import store from './redux/store/store';
import { useDispatch } from 'react-redux';
import { startGame } from './redux/actions';

function App() {
  const dispatch = useDispatch();
  return (
    <>
      {store.getState().inProgress ? (
        <MainPage />
      ) : (
        <Lobby handleClick={() => dispatch(startGame())} />
      )}
    </>
  );
}

export default App;
