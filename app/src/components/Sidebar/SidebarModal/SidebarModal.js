import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { linebasedfeedback } from '../../../utils/compareArrays/compareArrays';
import './SidebarModal.css';

export default function SidebarModal({
  title,
  description,
  buttonText,
  color,
  modalIsOpen,
  field,
  showFeedback,
  showClearBoardDialog,
  closeModal,
  clearBoard,
}) {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let correctSolution =
    currentTask.tasks[currentTaskNumber].solutionField.correct;
  let feedbackArray = linebasedfeedback(field, correctSolution);
  Modal.setAppElement('body');

  const modalStyle = {
    content: {
      width: '20em',
      height: '25em',
      margin: 'auto',
      border: '0.5em solid ' + color,
      borderRadius: '1em',
    },
  };
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
      <div className='modalContainer'>
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={closeModal}>{buttonText}</button>
        <button onClick={clearBoard} style={{ display: showClearBoardDialog }}>
          Yes
        </button>
        <ul style={{ display: showFeedback }}>
          {feedbackArray.map((item) => {
            return (
              <li
                className={item.isCorrect ? 'correctItem' : 'incorrectItem'}
                key={item.codeBlock.block.id}
              >
                {item.codeBlock.block.content}
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
