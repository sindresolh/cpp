import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import CodeBlock from '../../CodeBlock/CodeBlock';

export default function SidebarModal({
  title,
  description,
  buttonText,
  modalIsOpen,
  field,
  closeModal,
}) {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let correctSolution =
    currentTask.tasks[currentTaskNumber].solutionField.correct;
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{correctSolution[0].block.content}</p>
      <button onClick={closeModal}>{buttonText}</button>

      <ul>
        {}

        {correctSolution.map((codeBlock) => {
          return <li key={codeBlock.block.id}>{codeBlock.block.content}</li>;
        })}
      </ul>
    </Modal>
  );
}
