import './App.css';
import MainPage from './components/MainPage';

/**
 * Shows a lobby or the game based on wheter or not someone started the game from the lobby
 *
 * @returns
 */
function App() {
  document.title = 'Code puzzle';
  return <MainPage />;
}

export default App;
