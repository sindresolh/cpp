import './App.css';
import SelectScreen from './components/SelectScreen/SelectScreen';
import CreateTask from './components/CreateTask/CreateTask';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * App for creating new tasks and task-sets for CPP.
 */
function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SelectScreen />} />
          <Route path='createTask' element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
