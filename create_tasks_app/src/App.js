import './App.css';
import SelectScreen from './components/SelectScreen/SelectScreen';
import CreateTask from './components/CreateTask/CreateTask';

/**
 * App for creating new tasks and task-sets for CPP.
 */
function App() {
  return (
    <div className='App'>
      {
        //SelectScreen />
      }
      <CreateTask />
    </div>
  );
}

export default App;
