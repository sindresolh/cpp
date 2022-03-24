import './CreateSet.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
        return fileContents;
      })
    );
    return results;
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

  const saveTaskSet = () => {
    const contents = tasks.map((task) => task.content);
    console.log(contents);
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
