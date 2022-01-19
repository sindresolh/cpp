import React from 'react';
import './SelectScreen.css';

function SelectScreen() {
  return (
    <div className='container'>
      <h1 className='title'>Create-tasks-app (working title)</h1>
      <div className='buttonContainer'>
        <button className='button'>Create task</button>
        <button className='button'>Create set</button>
      </div>
    </div>
  );
}

export default SelectScreen;
