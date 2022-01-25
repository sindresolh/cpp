import React from 'react';
import Editor from 'react-simple-code-editor';
import { useState } from 'react';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import { SAMPLE_TEXT, CATEGORY } from './constants';
import './prism.css';
import './CreateTask.css';
import { useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json';

const DEFAULT_ATTEMPTS = 3;

/**
 * Sorts an array into two based on condition
 *
 * Taken from: https://stackoverflow.com/a/38863774
 */
export const bifilter = (f, xs) => {
  return xs.reduce(
    ([T, F], x, i, arr) => {
      if (f(x, i, arr) === false) return [T, [...F, x]];
      else return [[...T, x], F];
    },
    [[], []]
  );
};

/**
 * Trims and checks for '$' to check if it's a distractor
 *
 * @param {String} line
 * @returns whether the line is a distractor or not
 */
export const isADistractor = (line) => {
  let trimmedLine = line.trim(); // remove empty spaces at the start
  return trimmedLine.startsWith('$', 1);
};

/**
 * Checks if the line is NOT a comment.
 * The line is trimmed to remove tabs or spaces. Then the first character is checked to be a '#'.
 * The line could still be a distractor, so the next character also has to be checked.
 *
 * @param {String} line
 * @returns whether the line is a comment or not
 */
export const isNotAComment = (line) => {
  const trimmed = line.trim();
  return !trimmed.startsWith('#', 0) || trimmed.startsWith('$', 1);
};

/**
 * @returns two arrays: codeblocks and distractors
 */
export const getCodeBlocksAndDistractors = (code) => {
  let lines = code.split('\n'); // split string on new line
  lines = lines.map((line) => line.trimEnd()); // remove any excess spaces at the end
  lines = lines.filter(isNotAComment); // remove comments, but check for '$' in case it is a distractor
  lines = lines.filter((line) => line.length !== 0); // remove empty lines
  let [distractors, codeBlocks] = bifilter(
    (line) => isADistractor(line),
    lines
  ); // split lines into codeblocks and distracors
  // remove '#' and '$' from distractors
  distractors = distractors.map((distractor) => distractor.replace('#', ''));
  distractors = distractors.map((distractor) => distractor.replace('$', ''));

  return [codeBlocks, distractors];
};

/**
 * Categorises a line of code.
 * @param {String} code
 * @returns {Number} category of code
 */
export const categorizeCode = (code) => {
  let category;
  if (isAVariable(code)) category = CATEGORY.VARIABLE;
  else if (isALoop(code)) category = CATEGORY.LOOP;
  else if (isAFunction(code)) category = CATEGORY.FUNCTION;
  else category = CATEGORY.UNDEFINED;

  return category;
};

/**
 * Tests whether a string is a Python variable.
 * @param {String} string a line of code
 * @returns true if the string is a variable decleration
 */
const isAVariable = (string) => {
  const regex = /^[a-zA-z0-9]+\s*?=\s*?[a-zA-Z0-9'"_()]+$/;
  return regex.test(string);
};
/**
 * Tests whether a string is a Python function.
 * A line of code falls into the function category if it is a
 * function decleration OR a function.
 * E.g.: def my_function(arg): and my_function(arg) are both accepted.
 * @param {String} string a line of code
 * @returns true if the string is a function
 */
const isAFunction = (string) => {
  const regexFuncDecleration = /^def\s*?[a-zA-Z0-9'_()\[\]=":\s,*]+$/;
  const regexFuncCall = /^[a-zA-Z0-9_]+[a-zA-Z0-9'_()\[\]="\s,*]+:$/;
  return regexFuncDecleration.test(string) || regexFuncCall.test(string);
};

const isALoop = (string) => {
  const regexForLoop = /^for [a-zA-Z0-9_]+ in [a-zA-Z0-9'_()\[\]="\s,*]+:$/;
  const regexWhileLoop = /^while [a-zA-Z0-9_()]+\s*[!=<>]*\s*[a-zA-Z0-9_()]+:$/;
  return regexForLoop.test(string) || regexWhileLoop.test(string);
};

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
                console.log(data);
                const fileName = 'task';
                const exportType = exportFromJSON.types.csv;

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
