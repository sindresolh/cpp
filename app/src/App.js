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

function App() {
  return (
    <div className='App'>
      {/*<Counter/>*/}
      <DndProvider backend={HTML5Backend}>
        <div style={{ minWidth: '500px', float: 'left' }}>
          <HandList codeBlocks={props.player1} player={1} />
          <SolutionField codeLines={fieldProps.field} />
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
