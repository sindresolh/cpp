import './CreateSet.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import exportFromJSON from 'export-from-json';

/**
 * Credit: https://www.codegrepper.com/code-examples/javascript/javascript+check+if+valid+json
 *
 * Modified to also check properties.
 */
const jsonFormatIsValid = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  const json = JSON.parse(str)[0];
  const containsCorrectProperties =
    json.hasOwnProperty('codeBlocks') &&
    json.hasOwnProperty('distractors') &&
    json.hasOwnProperty('hints') &&
    json.hasOwnProperty('attempts') &&
    json.hasOwnProperty('field');
  return containsCorrectProperties;
};

/**
 * Read files locally and combine them into a tasks set.
 *
 * Credit for multiple-file-reading logic: https://stackoverflow.com/a/62424373
 */
function CreateSet() {
  let navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const readFileContents = async (file) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsText(file);
    });
  };
  const readAllFiles = async (allFiles) => {
    const results = await Promise.all(
      allFiles.map(async (file) => {
        const fileContents = {
          name: file.name,
          content: await readFileContents(file),
        };
        if (jsonFormatIsValid(fileContents.content)) {
          return fileContents;
        } else {
          alert(`File ${file.name} was discared due to invalid json format.`);
          return undefined;
        }
      })
    );

    // remove invalid data
    let validResults = results.filter((result) => result !== undefined);

    return validResults;
  };

  const handleUpload = (e) => {
    let allFiles = [];
    [...e.target.files].map((file) => allFiles.push(file));

    readAllFiles(allFiles)
      .then((result) => {
        setTasks([...result]);
      })
      .catch((err) => {
        alert(err);
      });
  };
  /**
   * Export tasks to a taskset json file.
   */
  const saveTaskSet = () => {
    let data = tasks.map((task) => JSON.parse(task.content));
    if (data.length !== 0) {
      const fileName = 'taskset';
      const exportType = exportFromJSON.types.json;

      exportFromJSON({ data, fileName, exportType });
    } else alert('No files are selected.');
  };

  return (
    <div className='container2'>
      <h1>Create task set</h1>
      <h5>
        Add tasks located on your computer to combine them into a task set.
      </h5>
      <h6>Use Command/Ctr + Click to select multiple tasks.</h6>
      <ul className='tasks'>
        {tasks.map((task, index) => (
          <li className='task' key={'task ' + index + 1}>{`Task ${
            index + 1
          } | ${task.name}`}</li>
        ))}
      </ul>
      <div style={{ margin: '5vh' }}>
        <form>
          <label style={{ color: 'black' }}>
            <input
              type='file'
              style={{ color: 'black', fontSize: '2vh' }}
              name='tasks'
              multiple='multiple'
              accept='.json'
              onChange={handleUpload}
            />
          </label>
        </form>
      </div>
      <div className='buttonDiv'>
        <button className='button cancel' onClick={() => navigate('/')}>
          Cancel
        </button>
        <button className='button save' onClick={() => saveTaskSet()}>
          Save task set
        </button>
      </div>
    </div>
  );
}

export default CreateSet;
