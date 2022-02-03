import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { linebasedfeedback } from '../../../utils/compareArrays/compareArrays';
import './SidebarModal.css';

/**
 *
 * @param {*}
 *            icon - icon for the header
 *            title - modal header
 *            description - modal paragprah
 *            buttonText- text to be displayed on the button
 *            borderColor - color for the border
 *            buttonColor - color for the button
 *            modalIsOpen: true or false
 *            field: feedback with correct and incorrect placed blocks
 *            showFeedback: display feedback
 *            showClearBoardialog: diaplay yes button for clearing the board
 *            closeModal: function for closing the modal
 *            clearBoard: function for clearing the board
 *
 * @returns
 */
export default function SidebarModal({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  borderColor,
  modalIsOpen,
  fieldBlocks,
  showFeedback = 'none',
  showClearBoardDialog = 'none',
  closeModal,
  clearBoard = null,
}) {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let correctSolution = currentTask.tasks[currentTaskNumber].codeBlocks;
  let feedbackArray = linebasedfeedback(fieldBlocks, correctSolution);

  Modal.setAppElement('body');

  let cancelButtonPosition = '7.5em';
  if (showClearBoardDialog == 'inline-block') {
    cancelButtonPosition = '3.5em';
  }

  const modalStyle = {
    content: {
      width: '20em',
      height: '25em',
      margin: 'auto',
      border: '0.5em solid ' + borderColor,
      borderRadius: '1em',
      background: '#f5f5f5',
    },
  };
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
      <div className='modalContainer'>
        <img height='25' width='auto' src={icon} alt='Icon' />
        <h2 style={{ display: 'inline', margin: '0.2em' }}>{title}</h2>
        <p>{description}</p>

        <button
          onClick={closeModal}
          style={{ background: buttonColor, left: cancelButtonPosition }}
        >
          {buttonText}
        </button>
        <button
          onClick={clearBoard}
          style={{ display: showClearBoardDialog, left: '12.5em' }}
          className='confirmButton'
        >
          Yes
        </button>

        <ul style={{ display: showFeedback }}>
          {feedbackArray.map((item) => {
            return (
              <li
                className={item.isCorrect ? 'correctItem' : 'incorrectItem'}
                key={item.codeBlock.id}
              >
                {item.codeBlock.code}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
