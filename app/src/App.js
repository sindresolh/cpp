import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';
import HandList from './components/HandList/HandList';
import { sampleHandLists as props } from './components/HandList/__test__/sample-list';
import { sampleField as fieldProps } from './components/SolutionField/__test__/sample-field';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SolutionField from './components/SolutionField/SolutionField';

function App() {
  return (
    <div className='App'>
      {/*<Counter/>*/}
      <DndProvider backend={HTML5Backend}>
        <SolutionField codeLines={fieldProps.field} />
      </DndProvider>
    </div>
  );
}

export default App;
