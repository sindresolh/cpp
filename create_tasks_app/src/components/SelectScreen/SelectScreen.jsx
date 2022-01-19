import React from 'react';
import './SelectScreen.css';
import { useNavigate } from 'react-router-dom';

/**
 * Allows creating new tasks or sets.
 *
 * @returns SelectScreen component
 */
function SelectScreen() {
  let navigate = useNavigate();
  return (
    <div className='selectScreen' data-testid={'selectScreen'}>
      <h1 className='title' data-testid={'title'}>
        Create-tasks-app (working title)
      </h1>
      <div className='buttonContainer'>
        <button
          data-testid={'createTaskButton'}
          className='button'
          onClick={() => navigate('/createTask')}
        >
          Create task
        </button>
        <button data-testid={'createSetButton'} className='button disabled'>
          Create set
        </button>
      </div>
    </div>
  );
}

export default SelectScreen;
