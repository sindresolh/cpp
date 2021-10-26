import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';

function App() {
  const counter = useSelector((state) => state.counter);
  return (
    <div className="App">
      <h1>Hallo verden</h1>
    </div>
  );
}

export default App;
