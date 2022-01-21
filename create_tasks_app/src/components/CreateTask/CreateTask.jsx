import React from 'react';
import Editor from 'react-simple-code-editor';
import { useState } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import { SAMPLE_TEXT } from './constants';
import './prism.css';
import './CreateTask.css';
import { useNavigate } from 'react-router-dom';

/**
 * Includes a code editor to write/add code. This code can be turned into a task.
 * User can properties such as description, hints, amount of attempts.
 *
 * @returns Create task component
 */
function CreateTask() {
  const [code, setCode] = useState(SAMPLE_TEXT);
  let navigate = useNavigate();
  return (
    <div className='container' data-testid={'createTask'}>
      <div className='leftContainer'>
        <Editor
          data-testid={'editor'}
          className='editor'
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages.py)}
          padding={10}
          style={{
            fontFamily: "'Fira code', 'Fira Mono', monospace",
            fontSize: 16, // TODO: adaptive font size based on screen size
          }}
        />
      </div>
      <div className='rightContainer'>
        <button className='cancelButton' onClick={() => navigate('/')}>
          Cancel
        </button>
        TODO: description, hints, attempts, save/export
      </div>
    </div>
  );
}

export default CreateTask;
