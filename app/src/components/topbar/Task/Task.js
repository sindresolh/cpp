import React from 'react';
import './Task.css';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../utils/constants';

export default function Task() {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];

  return (
    <div className='Task' style={{ background: COLORS.taskfield }}>
      <div>
        <label
          htmlFor='qual'
          data-testid='label'
          style={{ background: COLORS.taskfield }}
        >
          Task {currentTaskObject.id}
        </label>
      </div>
      <div>
        <textarea
          style={{ background: COLORS.taskfield }}
          data-testid='textarea'
          id='qual'
          rows='5'
          cols='60'
          readOnly
          placeholder='The task description should appear shortly'
          value={currentTaskObject.description}
          onChange={(event) => this.inputChangedHandler(event)}
        />
      </div>
    </div>
  );
}
