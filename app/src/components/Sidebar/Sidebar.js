import React, { useState } from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import SidebarModal from './SidebarModal/SidebarModal';
import { useDispatch, useSelector } from 'react-redux';
import { PLAYER } from '../../utils/constants';
import {
  nextTask,
  newTaskShoutEvent,
  cleanShoutEvent,
  setField,
  setList,
} from '../../redux/actions';
import { arrayIsEqual } from '../../utils/compareArrays/compareArrays';
import HintIcon from '../../images/hint.png';
import ClearIcon from '../../images/clean.png';
import SubmitIcon from '../../images/submit.png';

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const [modalColor, setModalColor] = useState('white');
  const [feedbackVisibility, setFeedbackVisibility] = useState('hidden');
  const [hasCleanBoardDialog, setHasCleanBoardDialog] = useState('hidden');
  const dispatch = useDispatch();
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];
  let field = useSelector((state) => state.solutionField);

  /* Close the modal. Callback from SideBarModal*/
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /**
   * Opens a new modal with the following parameters
   *
   * @param {*} title : header
   * @param {*} description : body text
   * @param {*} buttonText : text for the button that closes the model
   * @param {*} color : border color for the modal
   * @param {*} feedbackVisibility : 'hidden' or 'visible' based on wheter or not is an incorrect solution from submit
   * @param {*} isClean : 'hidden' or 'visible' based on wheter or not it was triggered from clean
   */
  const openModal = (
    title,
    description,
    buttonText,
    color,
    feedbackVisibility,
    isClean = 'hidden'
  ) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalButtonText(buttonText);
    setModalColor(color);
    setFeedbackVisibility(feedbackVisibility);
    setHasCleanBoardDialog(isClean);
    setModalIsOpen(true);
  };

  /**
   * Opens clean board dialog
   */
  const handleClean = () => {
    openModal(
      'Clean',
      'Are you sure you want to empty the board',
      'Cancel',
      'orange',
      'hidden',
      'visible'
    );
  };

  /**
   * Resets board to initial state
   */
  const cleanBoard = () => {
    closeModal();

    // update for me
    dispatch(setField(currentTaskObject.solutionField.field));
    dispatch(setList(currentTaskObject.handList.player1, PLAYER.P1 - 1));
    dispatch(setList(currentTaskObject.handList.player2, PLAYER.P2 - 1));
    dispatch(setList(currentTaskObject.handList.player3, PLAYER.P3 - 1));
    dispatch(setList(currentTaskObject.handList.player4, PLAYER.P4 - 1));

    //update for my team
    dispatch(cleanShoutEvent());
  };

  /**
   * Make all players go to the next task of the submit is correct
   */
  const handleSubmit = () => {
    if (currentTaskNumber === currentTask.tasks.length - 1) {
      openModal(
        'Task set finished',
        'Congratulations! You finished all the tasks.',
        'Finish',
        'green',
        'hidden'
      );
    } else if (arrayIsEqual(field, currentTaskObject.solutionField.correct)) {
      dispatch(nextTask());
      dispatch(newTaskShoutEvent());
      openModal(
        'Correct',
        'Continues to next task',
        'Next task',
        'green',
        'hidden'
      );
    } else {
      openModal(
        'Incorrect',
        'Unfortunately this is incorrect. Please try again.',
        'Try again',
        'red',
        'visible'
      );
    }
  };

  return (
    <div className='Sidebar'>
      {/* Popup for hint or submit */}
      <SidebarModal
        modalIsOpen={modalIsOpen}
        title={modalTitle}
        description={modalDescription}
        buttonText={modalButtonText}
        color={modalColor}
        field={field}
        showFeedback={feedbackVisibility}
        showCleanBoardDialog={hasCleanBoardDialog}
        closeModal={() => closeModal()}
        cleanBoard={() => cleanBoard()}
      />

      <div>
        <SidebarButton
          title='Hint'
          icon={HintIcon}
          color='#CBDA26'
          handleClick={() =>
            openModal(
              'Hint',
              currentTaskObject.hint,
              'Back to task',
              'yellow',
              'hidden'
            )
          }
        />
      </div>

      <div>
        <SidebarButton
          title='Clear'
          icon={ClearIcon}
          color='#DAB226'
          handleClick={() => handleClean()}
        />
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
