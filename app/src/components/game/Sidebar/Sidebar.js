import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import SidebarModal from './SidebarModal/SidebarModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  nextTask,
  taskEvent,
  clearEvent,
  setFieldState,
  setListState,
  finishGame,
  finishEvent,
} from '../../../redux/actions';
import { arrayIsEqual } from '../../../utils/compareArrays/compareArrays';
import HintIcon from '../../../utils/images/buttonIcons/hint.png';
import ClearIcon from '../../../utils/images/buttonIcons/clear.png';
import SubmitIcon from '../../../utils/images/buttonIcons/submit.png';
import CheckIcon from '../../../utils/images/buttonIcons/check.png';
import CrossIcon from '../../../utils/images/buttonIcons/cross.png';
import { COLORS } from '../../../utils/constants';
import { clearBoard as clearBoardHelper } from '../../../utils/shuffleCodeblocks/shuffleCodeblocks';
import store from '../../../redux/store/store';
import { deepCopy } from '../../../utils/compareArrays/compareArrays';

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
  const [currentfieldBlocks, setCurrentFieldBlocks] = useState([]); // fieldblocks from when submit was pressed
  const dispatch = useDispatch();
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];
  const fieldBlocks = useSelector((state) => state.solutionField);
  const [currentHintNo, setCurrentHintNo] = useState(0);
  const [finished, setFinished] = useState(false);

  /**
   * Reset current hint when a new task is started.
   */
  useEffect(() => {
    setCurrentHintNo(0);
  }, [currentTask]);

  /* Close the modal. Callback from SideBarModal*/
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /**
   * Dispatch the finish game action if all tasks are doene.
   */
  const showFinishedScren = () => {
    dispatch(finishGame());
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

    let initalfield = currentTaskObject.field;

    let field = store.getState().solutionField;
    let handList = store.getState().handList;
    handList = clearBoardHelper(field, handList);

    // Update board
    dispatch(setFieldState(initalfield));
    dispatch(setListState(handList));

    // Tell my team to reset solutionfield
    dispatch(clearEvent());
  };

  /**
   * Make all players go to the next task of the submit is correct
   */
  const handleSubmit = () => {
    setCurrentFieldBlocks(fieldBlocks);

    let correctSolution = arrayIsEqual(
      fieldBlocks,
      currentTaskObject.codeBlocks
    );

    // Check if this is correct as an alternative solution
    if (
      !correctSolution &&
      currentTaskObject.hasOwnProperty('otherSolutions')
    ) {
      for (var altSolution of currentTaskObject.otherSolutions) {
        correctSolution = arrayIsEqual(fieldBlocks, altSolution);
        if (correctSolution) break;
      }
    }

    const lastTask = currentTaskNumber === currentTask.tasks.length - 1;

    if (correctSolution && lastTask) {
      dispatch(finishEvent()); // notify other players this peer submitted the final task
      openModal(
        CheckIcon,
        'Task set finished',
        'Congratulations! You finished all the tasks.',
        'Finish',
        COLORS.lightgreen,
        COLORS.darkgreen,
        'none'
      );
      setFinished(true);
    } else if (correctSolution) {
      dispatch(nextTask());
      dispatch(taskEvent());
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
        fieldBlocks={currentfieldBlocks} // fieldblocks from when submit was pressed
        showFeedback={feedbackVisibility}
        showDialog={hasClearBoardDialog}
        closeModal={() => (finished ? showFinishedScren() : closeModal())}
        clickConfirm={() => clearBoard()}
      />

      <div>
        <SidebarButton
          title="Hint"
          icon={HintIcon}
          color={COLORS.lightyellow}
          handleClick={() => {
            openModal(
              HintIcon,
              `Hint ${currentHintNo + 1}/${currentTaskObject.hints.length}`,
              currentTaskObject.hints[currentHintNo],
              'Back to task',
              COLORS.lightyellow,
              COLORS.darkyellow,
              'none'
            );
            let updatedCurrentHintNo =
              currentHintNo < currentTaskObject.hints.length - 1
                ? currentHintNo + 1
                : 0;
            setCurrentHintNo(updatedCurrentHintNo);
          }}
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
