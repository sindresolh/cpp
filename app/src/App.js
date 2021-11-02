import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';
import HandList from './components/HandList/HandList';
import { sampleHandLists as props } from './components/HandList/__test__/sample-list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import MainPage from './components/MainPage';

function App() {
  return (
    <div className="App">
      <MainPage />
    </div>
  );
}

export default App;
