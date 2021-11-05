import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';

import './App.css';
import MainPage from './components/MainPage';

function App() {
  return (
    <div className='App'>
      <MainPage />
    </div>
  );
}

export default App;
