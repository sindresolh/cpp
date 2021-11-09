import React from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import { useDispatch, useSelector } from 'react-redux';
import { nextTask, newTaskShoutEvent } from '../../redux/actions';
import { arrayIsEqual } from '../../utils/compareArrays/compareArrays';

export default function Sidebar() {
  const dispatch = useDispatch();

  const field = useSelector((state) => state.solutionField);
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];

  /**
   * Make all players go to the next task of the submit is correct
   */
  const handleSubmit = () => {
    if (arrayIsEqual(field, currentTaskObject.solutionField.correct)) {
      dispatch(nextTask());
      dispatch(newTaskShoutEvent());
    }
  };
  return (
    <div className="Sidebar">
      <div>
        <SidebarButton title="Hint" />
      </div>

      <div>
        <SidebarButton title="Clean" />
      </div>

      <div className="BottomButton">
        <SidebarButton title="Submit" handleClick={() => handleSubmit()} />
      </div>
    </div>
  );
}
