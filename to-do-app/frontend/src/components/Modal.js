import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, handleSave, initialText }) => {
  const [newText, setNewText] = useState(initialText);

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit ToDo</h2>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button onClick={() => handleSave(newText)}>Save</button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
