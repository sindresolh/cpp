import React from 'react';
import './Task.css';

export default function Task() {
  return (
    <div className="Task">
      <div>
        <label for="qual">Task 1</label>
      </div>
      <div>
        <textarea
          id="qual"
          rows="5"
          cols="60"
          placeholder="The secondary heading of this space in brackets"
        ></textarea>
      </div>
    </div>
  );
}
