import { useSelector } from 'react-redux';
import CounterComponent from './redux/testcomponents/counterComponent';

function App() {
  const counter = useSelector((state) => state.counter);
  return (
    <div className="App">
      <CounterComponent />
    </div>
  );
}

export default App;
