import React from 'react';
import Editor from 'react-simple-code-editor';
import { useState } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import { SAMPLE_TEXT } from './constants';
import './prism.css';
import './CreateTask.css';
import { useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json';
import { getCodeBlocksAndDistractors } from './util';

const DEFAULT_ATTEMPTS = 3;

/**
 * Includes a code editor to write/add code. This code can be turned into a task.
 * User can properties such as description, hints, amount of attempts.
 *
 * @returns Create task component
 */
function CreateTask() {
  const [code, setCode] = useState(SAMPLE_TEXT);
  const [description, setDescription] = useState('');
  const [hints, setHints] = useState(['']);
  const [unlimitedAttempts, setUnlimitedAttempts] = useState(true);
  const [amountOfAttempts, setAmountOfAttempts] = useState(DEFAULT_ATTEMPTS);
  let navigate = useNavigate();

  /**
   * Takes content from code editor and returns the codeblocks and distractors
   *
   * @returns all inputs as JSON
   */
  const getInputsAsJSON = () => {
    const [codeBlocks, distractors] = getCodeBlocksAndDistractors(code);

    const inputs = {
      codeBlocks,
      distractors,
      description,
      hints,
      attempts: unlimitedAttempts ? 'unlimited' : amountOfAttempts,
      field: [], // TODO: mulighet til å lage oppgaver med initielt field
    };
    return [inputs];
  };

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
        <div className='rightContainerTop'>
          <div className='textAreaContainer'>
            <div className='textAreaFlex'>
              <textarea
                className='textarea'
                data-testid={'description'}
                rows={5}
                placeholder='Description for the task'
                id='description'
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className='hints' data-testid={'hints'}>
            <h3>Hints</h3>
            {hints.map((hint, index) => {
              let updatedHints = [...hints];

              return (
                <div className='textAreaContainer' key={`hint-${index}`}>
                  <div className='textAreaFlex' key={`hint-${index}`}>
                    <textarea
                      className='hintInput'
                      rows={3}
                      key={`hint-${index}`}
                      id={`hint-${index}`}
                      placeholder='Give a hint to the players'
                      value={hint}
                      onChange={(event) => {
                        updatedHints[index] = event.target.value;
                        setHints([...updatedHints]);
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setHints([...hints, ''])}
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
          <div className='attemptsDiv' data-testid={'attempts'}>
            <h3>Amount of attempts</h3>
            <input
              type='number'
              id='attempts'
              name='attempts'
              min='1'
              step='1'
              defaultValue={DEFAULT_ATTEMPTS}
              disabled={unlimitedAttempts}
              required={!unlimitedAttempts}
              onChange={(event) => setAmountOfAttempts(event.target.value)}
            />
            <div className='checkboxDiv'>
              <input
                type='checkbox'
                id='unlimitedAttempts'
                name='unlimitedAttempts'
                value={'unlimited'}
                checked={unlimitedAttempts}
                onChange={() => {
                  setUnlimitedAttempts(!unlimitedAttempts);
                }}
              />
              <label htmlFor='unlimitedAttempts'>Unlimited</label>
            </div>
          </div>
        </div>
        <div className='rightContainerBottom'>
          <div className='buttonDiv'>
            <button className='button cancel' onClick={() => navigate('/')}>
              Cancel
            </button>
            <button
              className='button save'
              onClick={() => {
                const data = getInputsAsJSON();
                const fileName = 'task';
                const exportType = exportFromJSON.types.json;

                exportFromJSON({ data, fileName, exportType });
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
