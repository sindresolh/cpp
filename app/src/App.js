import { useSelector } from 'react-redux';
import CommunicationHandler from './communication/CommunicationHandler';
import Counter from './redux/testcomponents/counterComponent';

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
