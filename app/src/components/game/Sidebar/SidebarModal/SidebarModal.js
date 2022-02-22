import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { linebasedfeedback } from '../../../../utils/compareArrays/compareArrays';
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
 *            showDialog: display yes button for clearing the board
 *            closeModal: function for closing the modal
 *            clickConfirm: function for confirming to the modal
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
  showDialog = 'none',
  closeModal,
  clickConfirm = null,
  incrementHint = null,
  decrementHint = null,
  hintModal = 'none',
}) {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let correctSolution = currentTask.tasks[currentTaskNumber].codeBlocks;
  let otherSolutions = currentTask.tasks[currentTaskNumber].otherSolutions;
  let feedbackArray = linebasedfeedback(
    fieldBlocks,
    correctSolution,
    otherSolutions
  );

  Modal.setAppElement('body');

  // Change styling if there is two buttons
  let cancelButtonPosition = '10em';
  if (showDialog === 'inline-block') {
    cancelButtonPosition = '4em';
  }

  // Change lenght of modal based on the number of codelines
  let modalHeight = '18em';
  if (showFeedback === 'block' && feedbackArray.length > 0) {
    let mHeight = 25 + 5 * ((feedbackArray.length / 4) >> 0);
    mHeight = mHeight < 50 ? mHeight : 50;
    modalHeight = mHeight.toString() + 'em';
  }

  const modalStyle = {
    content: {
      width: '25em',
      height: modalHeight,
      margin: 'auto',
      border: '0.5em solid ' + borderColor,
      borderRadius: '1em',
      background: '#f5f5f5',
    },
  };
  /**
   * Sets the backround color of the button. CSS hover cannot be used since color is set inline from a prop.
   *
   * @param {*} e : event
   * @param {*} backgroundColor : hexcode
   */
  function setBackground(e, backgroundColor) {
    e.target.style.background = backgroundColor;
  }
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyle}>
      <div className='modalContainer'>
        <img height='25' width='auto' src={icon} alt='Icon' />
        <h2 style={{ display: 'inline', margin: '0.2em' }}>{title}</h2>

        <p style={{ margin: '2em' }}>{description}</p>

        <div
          style={{
            display: 'hintModal',
            marginRight: '0.7em',
            paddingTop: '1.5em',
          }}
        >
          <button onClick={decrementHint} style={{ marginRight: '1em' }}>
            <i class='arrow left'></i>
          </button>
          <button onClick={incrementHint} style={{ marginLeft: '1em' }}>
            <i class='arrow right'></i>
          </button>
        </div>

        <button
          onClick={closeModal}
          onMouseEnter={(e) => setBackground(e, '#c2c2c2')}
          onMouseLeave={(e) => setBackground(e, buttonColor)}
          style={{ background: buttonColor, left: cancelButtonPosition }}
        >
          {buttonText}
        </button>
        <button
          onClick={clickConfirm}
          style={{ display: showDialog, left: '16em' }}
          className='confirmButton'
        >
          Yes
        </button>

        <ul style={{ display: showFeedback }}>
          {feedbackArray.map((item, index) => {
            return (
              <li key={index}>
                <hr style={{ width: 2 * item.codeBlock.indent + 'em' }} />

                <div
                  className={item.isCorrect ? 'correctItem' : 'incorrectItem'}
                  style={{
                    marginLeft: 2 * item.codeBlock.indent + 'em',
                    borderRadius: '0.4em',
                    width: 'fit-content',
                    padding: '0.2em',
                  }}
                  key={item.codeBlock.id}
                >
                  <code>{item.codeBlock.code}</code>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Modal>
  );
}
