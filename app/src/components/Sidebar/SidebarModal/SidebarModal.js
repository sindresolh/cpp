import React from 'react';
import Modal from 'react-modal';

export default function SidebarModal({
  title,
  description,
  buttonText,
  modalIsOpen,
  closeModal,
}) {
  return (
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={closeModal}>{buttonText}</button>
    </Modal>
  );
}
