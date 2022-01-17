import React, { useState } from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import SidebarModal from './SidebarModal/SidebarModal';
import { useDispatch, useSelector } from 'react-redux';
import { PLAYER } from '../../utils/constants';
import {
  nextTask,
  newTaskShoutEvent,
  clearShoutEvent,
  setField,
  setList,
} from '../../redux/actions';
import { arrayIsEqual } from '../../utils/compareArrays/compareArrays';
import HintIcon from '../../images/buttonIcons/hint.png';
import ClearIcon from '../../images/buttonIcons/clear.png';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import { COLORS } from '../../utils/constants';

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const [modalColor, setModalColor] = useState('white');
  const [feedbackVisibility, setFeedbackVisibility] = useState('none');
  const [hasClearBoardDialog, setHasClearBoardDialog] = useState('none');
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
   * @param {*} feedbackVisibility : 'none' or 'block' based on wheter or not is an incorrect solution from submit
   * @param {*} isClear : 'none' or 'block' based on wheter or not it was triggered from Clear
   */
  const openModal = (
    title,
    description,
    buttonText,
    color,
    feedbackVisibility,
    isClear = 'none'
  ) => {
    setModalTitle(title);
    setModalDescription(description);
    setModalButtonText(buttonText);
    setModalColor(color);
    setFeedbackVisibility(feedbackVisibility);
    setHasClearBoardDialog(isClear);
    setModalIsOpen(true);
  };

  /**
   * Opens Clear board dialog
   */
  const handleClear = () => {
    openModal(
      'Clear',
      'Are you sure you want to empty the board',
      'Cancel',
      COLORS.darkred,
      'none',
      'inline-block'
    );
  };

  /**
   * Resets board to initial state
   */
  const clearBoard = () => {
    closeModal();

    // update for me
    dispatch(setField(currentTaskObject.solutionField.field));
    dispatch(setList(currentTaskObject.handList.player1, PLAYER.P1 - 1));
    dispatch(setList(currentTaskObject.handList.player2, PLAYER.P2 - 1));
    dispatch(setList(currentTaskObject.handList.player3, PLAYER.P3 - 1));
    dispatch(setList(currentTaskObject.handList.player4, PLAYER.P4 - 1));

    //update for my team
    dispatch(clearShoutEvent());
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
        COLORS.darkgreen,
        'none'
      );
    } else if (arrayIsEqual(field, currentTaskObject.solutionField.correct)) {
      dispatch(nextTask());
      dispatch(newTaskShoutEvent());
      openModal(
        'Correct',
        'Continues to next task',
        'Next task',
        COLORS.darkgreen,
        'none'
      );
    } else {
      openModal(
        'Incorrect',
        'Unfortunately this is incorrect. Please try again.',
        'Try again',
        COLORS.darkred,
        'block'
      );
    }
  };

  return (
    <div className='Sidebar' style={{ background: COLORS.sidebar }}>
      {/* Popup for hint or submit */}
      <SidebarModal
        modalIsOpen={modalIsOpen}
        title={modalTitle}
        description={modalDescription}
        buttonText={modalButtonText}
        color={modalColor}
        field={field}
        showFeedback={feedbackVisibility}
        showClearBoardDialog={hasClearBoardDialog}
        closeModal={() => closeModal()}
        clearBoard={() => clearBoard()}
      />

      <div>
        <SidebarButton
          title='Hint'
          icon={HintIcon}
          color={COLORS.lightyellow}
          handleClick={() =>
            openModal(
              'Hint',
              currentTaskObject.hint,
              'Back to task',
              COLORS.darkyellow,
              'none'
            )
          }
        />
      </div>

      <div>
        <SidebarButton
          title='Clear'
          icon={ClearIcon}
          color={COLORS.lightred}
          handleClick={() => handleClear()}
        />
      </div>

      <div className='BottomButton'>
        <SidebarButton
          title='Submit'
          icon={SubmitIcon}
          color={COLORS.lightgreen}
          handleClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
}
