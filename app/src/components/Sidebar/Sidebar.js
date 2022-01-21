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
  setFieldState,
  setListState,
} from '../../redux/actions';
import { arrayIsEqual } from '../../utils/compareArrays/compareArrays';
import HintIcon from '../../images/buttonIcons/hint.png';
import ClearIcon from '../../images/buttonIcons/clear.png';
import SubmitIcon from '../../images/buttonIcons/submit.png';
import CheckIcon from '../../images/buttonIcons/check.png';
import CrossIcon from '../../images/buttonIcons/cross.png';
import { COLORS } from '../../utils/constants';
import { clearBoard as clearBoardHelper } from '../../utils/shuffleCodeblocks/shuffleCodeblocks';
import store from '../../redux/store/store';

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState(HintIcon);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const [modalButtonColor, setModalButtonColor] = useState('white');
  const [modalBorderColor, setModalBorderColor] = useState('white');
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
   * @param {*} icon : icon for the modal
   * @param {*} title : header
   * @param {*} description : body text
   * @param {*} buttonText : text for the button that closes the model
   * @param {*} color : border color for the modal
   * @param {*} feedbackVisibility : 'none' or 'block' based on wheter or not is an incorrect solution from submit
   * @param {*} isClear : 'none' or 'block' based on wheter or not it was triggered from Clear
   */
  const openModal = (
    icon,
    title,
    description,
    buttonText,
    buttonColor,
    borderColor,
    feedbackVisibility,
    isClear = 'none'
  ) => {
    setModalIcon(icon);
    setModalTitle(title);
    setModalDescription(description);
    setModalButtonText(buttonText);
    setModalButtonColor(buttonColor);
    setModalBorderColor(borderColor);
    setFeedbackVisibility(feedbackVisibility);
    setHasClearBoardDialog(isClear);
    setModalIsOpen(true);
  };

  /**
   * Opens Clear board dialog
   */
  const handleClear = () => {
    openModal(
      ClearIcon,
      'Clear',
      'Are you sure you want to empty the board?',
      'Cancel',
      COLORS.lightred,
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

    let initalfield = currentTaskObject.solutionField.field;

    let field = store.getState().solutionField;
    let handList = store.getState().handList;
    handList = clearBoardHelper(field, handList);

    // Update board
    dispatch(setFieldState([])); // TODO: Add unnasigned property to initial codeblocks
    dispatch(setListState(handList));

    // Tell my team to reset solutionfield
    dispatch(clearShoutEvent());
  };

  /**
   * Make all players go to the next task of the submit is correct
   */
  const handleSubmit = () => {
    if (currentTaskNumber === currentTask.tasks.length - 1) {
      openModal(
        CheckIcon,
        'Task set finished',
        'Congratulations! You finished all the tasks.',
        'Finish',
        COLORS.lightgreen,
        COLORS.darkgreen,
        'none'
      );
    } else if (arrayIsEqual(field, currentTaskObject.solutionField.correct)) {
      dispatch(nextTask());
      dispatch(newTaskShoutEvent());
      openModal(
        CheckIcon,
        'Correct',
        'Continues to next task',
        'Next task',
        COLORS.lightgreen,
        COLORS.darkgreen,
        'none'
      );
    } else {
      openModal(
        CrossIcon,
        'Incorrect',
        'Unfortunately this is incorrect. Please try again.',
        'Try again',
        COLORS.lightred,
        COLORS.darkred,
        'block'
      );
    }
  };

  return (
    <div className="Sidebar" style={{ background: COLORS.sidebar }}>
      {/* Popup for hint or submit */}
      <SidebarModal
        modalIsOpen={modalIsOpen}
        icon={modalIcon}
        title={modalTitle}
        description={modalDescription}
        buttonText={modalButtonText}
        buttonColor={modalButtonColor}
        borderColor={modalBorderColor}
        field={field}
        showFeedback={feedbackVisibility}
        showClearBoardDialog={hasClearBoardDialog}
        closeModal={() => closeModal()}
        clearBoard={() => clearBoard()}
      />

      <div>
        <SidebarButton
          title="Hint"
          icon={HintIcon}
          color={COLORS.lightyellow}
          handleClick={() =>
            openModal(
              HintIcon,
              'Hint',
              currentTaskObject.hint,
              'Back to task',
              COLORS.lightyellow,
              COLORS.darkyellow,
              'none'
            )
          }
        />
      </div>

      <div>
        <SidebarButton
          title="Clear"
          icon={ClearIcon}
          color={COLORS.lightred}
          handleClick={() => handleClear()}
        />
      </div>

      <div className="BottomButton">
        <SidebarButton
          title="Submit"
          icon={SubmitIcon}
          color={COLORS.lightgreen}
          handleClick={() => handleSubmit()}
        />
      </div>
    </div>
  );
}
