import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import SidebarModal from './SidebarModal/SidebarModal';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  nextTask,
  taskEvent,
  clearEvent,
  setFieldState,
  setListState,
  finishGame,
  finishEvent,
  setAllocatedListsForCurrentTask,
  lockRequest,
  lockEvent,
  setPlayers,
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
import LockIcon from '../../../utils/images/buttonIcons/lock.png';
import UnlockIcon from '../../../utils/images/buttonIcons/unlock.png';

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState(HintIcon);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const [modalButtonColor, setModalButtonColor] = useState('white');
  const [modalBorderColor, setModalBorderColor] = useState('white');
  const [feedbackVisibility, setFeedbackVisibility] = useState('none');
  const [hasDialog, setDialog] = useState('none');
  const [currentfieldBlocks, setCurrentFieldBlocks] = useState([]); // fieldblocks from when submit was pressed
  const [hintModal, setHintModal] = useState('none');
  const dispatch = useDispatch();
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];
  const fieldBlocks = useSelector((state) => state.solutionField);
  const [currentHintNo, setCurrentHintNo] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const numberOfPlayers = useSelector((state) => state.players.length);
  const newLockEvent = useSelector((state) => state.lockEvent); // Keeps track of new lock events
  const [lockedInPlayers, setLockedInPlayers] = useState([
    false,
    false,
    false,
    false,
  ]); // One for each player and wheter or not they are locked in
  const [numberOfLockedInPlayers, setNumberOfLockedInPlayers] = useState(0);

  /**
   * Reset current hint when a new task is started.
   */
  useEffect(() => {
    if (modalTitle.includes('Hint')) {
      setModalIsOpen(false);
    }
    setCurrentHintNo(0);
  }, [currentTask]);

  /**
   * Update the hint modal when changing current hint number
   */
  useEffect(() => {
    if (modalIsOpen) {
      handleHint();
    }
  }, [currentHintNo]);

  /**
   * Update when I get a new locked event from host
   */
  useEffect(() => {
    // I am NOT HOST and need to update my state
    let players = store.getState().players;
    let playerNumber = 0;
    for (let p of players) {
      if (!p.hasOwnProperty('lock')) {
        p.lock = false;
      }
      if (p.id === 'YOU') {
        setLocked(p.lock);
      }
      lockedInPlayers[playerNumber] = p.lock;
      setLockedInPlayers(lockedInPlayers);
      ++playerNumber;
    }
    console.log(lockedInPlayers);

    setNumberOfLockedInPlayers(
      lockedInPlayers.filter((lock) => lock === true).length
    );
  }, [newLockEvent]);

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
   * @param {*} hasDialog : 'none' or 'block' based on wheter or not it was triggered from Clear
   */
  const openModal = (
    icon,
    title,
    description,
    buttonText,
    buttonColor,
    borderColor,
    feedbackVisibility,
    hasDialog = 'none',
    hintModal = 'none'
  ) => {
    setModalIcon(icon);
    setModalTitle(title);
    setModalDescription(description);
    setModalButtonText(buttonText);
    setModalButtonColor(buttonColor);
    setModalBorderColor(borderColor);
    setFeedbackVisibility(feedbackVisibility);
    setDialog(hasDialog);
    setHintModal(hintModal);
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

    // let field = store.getState().solutionField;
    // let handList = store.getState().handList;
    // handList = clearBoardHelper(field, handList);

    // // Update board
    dispatch(setFieldState(initalfield));
    // dispatch(setListState(handList));

    const allocatedLists = store.getState().allocatedLists;
    dispatch(setListState(allocatedLists));

    // Tell my team to reset solutionfield
    dispatch(clearEvent());
  };

  /**
   * @returns true if this player is the host.
   */
  const iAmHost = () => {
    return store.getState().host === '';
  };

  /**
   * Handle a click on the lock button.
   */
  const handleLock = () => {
    // If I am the HOST I update for myself and the other players
    if (iAmHost()) {
      let players = store.getState().players;
      let playerNumber = 0;

      for (let p of players) {
        if (p.id === 'YOU') {
          if (!p.hasOwnProperty('lock')) {
            p.lock = true;
          } else {
            p.lock = !p.lock;
          }
          dispatch(setPlayers(players));
          dispatch(lockEvent({ pid: 'HOST', lock: p.lock }));
        }
      }
      setNumberOfLockedInPlayers(
        lockedInPlayers.filter((lock) => lock === true).length
      );
      console.log(lockedInPlayers + ' I am host');
    } else {
      // If I am not he HOST I need to ask for permission
      dispatch(lockRequest());
    }
  };

  /**
   * Confirm modal to be displayed before the feedbackmodal
   */
  const confirmSubmit = () => {
    openModal(
      SubmitIcon,
      'Submit',
      'Are you sure you want to submit for the entire group?',
      'Cancel',
      COLORS.lightred,
      COLORS.darkgreen,
      'none',
      'inline-block'
    );
  };

  /**
   * Make all players go to the next task of the submit is correct
   */
  const handleSubmit = () => {
    closeModal();
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

  /**
   * Opens Clear board dialog
   */
  const handleHint = () => {
    openModal(
      HintIcon,
      `Hint ${currentHintNo + 1}/${currentTaskObject.hints.length}`,
      currentTaskObject.hints[currentHintNo],
      'Back to task',
      COLORS.lightyellow,
      COLORS.darkyellow,
      'none',
      'none',
      'inline-block'
    );
  };

  /**
   * Incement or decrement
   *
   * @param {*} operator : + or -
   */
  const changeHint = (operator) => {
    let updatedCurrentHintNo = 0;
    if (operator === '+') {
      updatedCurrentHintNo =
        currentHintNo < currentTaskObject.hints.length - 1
          ? currentHintNo + 1
          : 0;
    } else if (operator === '-') {
      updatedCurrentHintNo =
        currentHintNo > 0
          ? currentHintNo - 1
          : currentTaskObject.hints.length - 1;
    }

    setCurrentHintNo(updatedCurrentHintNo);
  };

  return (
    <div className='Sidebar' style={{ background: COLORS.sidebar }}>
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
        showDialog={hasDialog}
        closeModal={() => (finished ? showFinishedScren() : closeModal())}
        clickConfirm={() =>
          modalTitle === 'Clear' ? clearBoard() : handleSubmit()
        }
        incrementHint={() => changeHint('+')}
        decrementHint={() => changeHint('-')}
        hintModal={hintModal}
      />

      <div>
        <SidebarButton
          title='Hint'
          icon={HintIcon}
          color={COLORS.lightyellow}
          handleClick={() => {
            handleHint();
          }}
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

      <p>{numberOfLockedInPlayers + ' / ' + numberOfPlayers}</p>

      <div className='BottomButton'>
        <SidebarButton
          title={locked ? 'Unlock' : 'Lock in'}
          icon={locked ? UnlockIcon : LockIcon}
          color={locked ? COLORS.lightred : COLORS.lightgreen}
          handleClick={() => handleLock()}
        />
      </div>
    </div>
  );
}
