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
  closeModal,
}) {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let correctSolution =
    currentTask.tasks[currentTaskNumber].solutionField.correct;
  let feedbackArray = linebasedfeedback(field, correctSolution);

  const modalStyle = {
    content: {
      width: '20em',
      height: '25em',
      margin: 'auto',
      border: '1em solid ' + color,
      borderRadius: '3em',
    },
  };
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={closeModal}>{buttonText}</button>
      <ul style={{ visibility: showFeedback }}>
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
    </Modal>
  );
}
