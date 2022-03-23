import React from 'react';
import './CreateSet.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const sampleTasks = [
  { title: 'sumlist' },
  { title: 'createFunction' },
  { title: 'whileLoop' },
];

function CreateSet() {
  let navigate = useNavigate();
  const [tasks, setTasks] = useState(sampleTasks);

  return (
    <div className='container2'>
      <h1>Create task set</h1>
      <h5>
        Add tasks located on your computer to combine them into a task set.
      </h5>
      <ul className='tasks'>
        {tasks.map((task, index) => (
          <li className='task' key={'task ' + index + 1}>{`Task ${
            index + 1
          } | ${task.title}`}</li>
        ))}
      </ul>
      <div className='buttonDiv'>
        <button className='button cancel' onClick={() => navigate('/')}>
          Cancel
        </button>
        <button
          className='button save'
          onClick={() => {
            console.log('save');
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CreateSet;
