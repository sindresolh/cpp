import React from 'react';
import './SelectScreen.css';

/**
 * Allows creating new tasks or sets.
 *
 * @returns SelectScreen component
 */
function SelectScreen() {
  return (
    <div className='container' data-testid={'selectScreen'}>
      <h1 className='title' data-testid={'title'}>
        Create-tasks-app (working title)
      </h1>
      <div className='buttonContainer'>
        <button data-testid={'createTaskButton'} className='button'>
          Create task
        </button>
        <button data-testid={'createSetButton'} className='button'>
          Create set
        </button>
      </div>
    </div>
  );
}

export default SelectScreen;
