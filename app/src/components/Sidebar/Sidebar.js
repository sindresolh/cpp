import React from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import { useDispatch, useSelector } from 'react-redux';
import { nextTask, newTaskShoutEvent } from '../../redux/actions';
import { arrayIsEqual } from '../../utils/compareArrays/compareArrays';
import HintIcon from '../../images/hint.png';
import ClearIcon from '../../images/clean.png';
import SubmitIcon from '../../images/submit.png';

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
    if (currentTaskNumber === currentTask.tasks.length - 1) {
      alert('Gratulerer! Dere har fullført alle oppgavene.');
    } else if (arrayIsEqual(field, currentTaskObject.solutionField.correct)) {
      dispatch(nextTask());
      dispatch(newTaskShoutEvent());
      alert('Riktig! Går videre til neste oppgave.');
    } else {
      alert('Dette ble dessverre ikke riktig. Vennligst prøv igjen.');
    }
  };
  return (
    <div className='Sidebar'>
      <div>
        <SidebarButton title='Hint' icon={HintIcon} color='#CBDA26' />
      </div>

      <div>
        <SidebarButton title='Clean' icon={ClearIcon} color='#DAB226' />
      </div>

      <div className='BottomButton'>
        <SidebarButton
          title='Submit'
          icon={SubmitIcon}
          color='#3FDA26'
          handleClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
}
