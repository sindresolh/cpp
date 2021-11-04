import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';
import HandList from './components/HandList/HandList';
import {
  sampleHandLists as props,
  sampleField as fieldProps,
} from './utils/sample-data';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SolutionField from './components/SolutionField/SolutionField';

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
