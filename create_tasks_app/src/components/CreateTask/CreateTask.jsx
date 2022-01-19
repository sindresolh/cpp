import React from 'react';
import Editor from 'react-simple-code-editor';
import { useState } from 'react';
import Prism from 'prismjs';
import './CreateTask.css';

/**
 * Includes a code editor to write/add code. This code can be turned into a task.
 * User can properties such as description, hints, amount of attempts.
 *
 * @returns Create task component
 */
function CreateTask() {
  const [code, setCode] = useState('');
  return (
    <div className='container'>
      <div className='leftContainer'>
        <Editor
          className='editor'
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => Prism.highlight(code, Prism.languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 20,
          }}
        />
      </div>
      <div className='rightContainer'></div>
    </div>
  );
}

export default CreateTask;
