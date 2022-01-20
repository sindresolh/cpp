import React from 'react';
import Editor from 'react-simple-code-editor';
import { useState } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import { SAMPLE_TEXT } from './constants';
import './prism.css';
import './CreateTask.css';
import { useNavigate } from 'react-router-dom';

const Hint = (props) => {
  const number = props.number;
  return (
    <div
      className='textAreaContainer'
      id={`hint-${number}`}
      key={`hint-${number}`}
    >
      <div className='textAreaFlex' key={`hint-${number}`}>
        <textarea className='hintInput' rows={3} key={`hint-${number}`} />
      </div>
    </div>
  );
};

/**
 * Includes a code editor to write/add code. This code can be turned into a task.
 * User can properties such as description, hints, amount of attempts.
 *
 * @returns Create task component
 */
function CreateTask() {
  const [code, setCode] = useState(SAMPLE_TEXT);
  const [hints, setHints] = useState([<Hint number={1} />]);
  const hintLength = hints.length;
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
        <div className='textAreaContainer'>
          <div className='textAreaFlex'>
            <textarea
              className='textarea'
              rows={5}
              placeholder='Description for the task'
              id='description'
            />
          </div>
        </div>
        <div className='hints'>
          <h3>Hints</h3>
          {hints}
          <button
            onClick={() =>
              setHints([...hints, <Hint number={hints.length + 1} />])
            }
            disabled={hints.length > 4} // max 5 hints for now
          >
            +
          </button>
          <button
            onClick={() => {
              let updatedHints = [...hints];
              updatedHints.pop();
              setHints([...updatedHints]);
            }}
            disabled={hints.length < 2}
          >
            -
          </button>
        </div>
        <button className='cancelButton' onClick={() => navigate('/')}>
          Cancel
        </button>
        TODO: description, hints, attempts, save/export
      </div>
    </div>
  );
}

export default CreateTask;
