import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';
import HandList from './components/HandList/HandList';
import { sampleHandLists as props } from './components/HandList/__test__/sample-list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <div className='App'>
      {/*<Counter/>*/}
      <DndProvider backend={HTML5Backend}>
        <HandList codeBlocks={props.player1} player={1} />
      </DndProvider>
    </div>
  );
}

export default App;
