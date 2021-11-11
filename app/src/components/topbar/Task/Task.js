import React from 'react';
import './Task.css';
import { useSelector } from 'react-redux';

export default function Task() {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];

  return (
    <div className="Task">
      <div>
        <label htmlFor="qual" data-testid="label">
          Task {currentTaskObject.id}
        </label>
      </div>
      <div>
        <textarea
          data-testid="textarea"
          id="qual"
          rows="5"
          cols="60"
          placeholder="The task description should appear shortly"
          value={currentTaskObject.description}
          onChange={(event) => this.inputChangedHandler(event)}
        />
      </div>
    </div>
  );
}
