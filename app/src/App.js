import { useSelector } from 'react-redux';
import CodeBlock from './components/CodeBlock/CodeBlock';
import CounterComponent from './redux/testcomponents/counterComponent';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { sampleBlockP4 as propsP1 } from './components/CodeBlock/__test__/sample-block';
import { DndProvider } from 'react-dnd';

function App() {
  const counter = useSelector((state) => state.counter);
  return (
    <div className='App'>
      <CounterComponent />
    </div>
  );
}

export default App;
