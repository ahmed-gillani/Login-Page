// src/components/delete.jsx
import React from "react";
import Modal from "./Modal";

export default function DeleteUser({ user, onConfirm, onCancel }) {
  return (
    <Modal title="Delete User" onClose={onCancel}>
      <p>Are you sure you want to delete <strong>{user.name}</strong> (ID: {user.id})?</p>
      <div className="modal-actions">
        <button className="btn danger" type="button" onClick={() => { onConfirm(); }}>
          Yes, Delete
        </button>
        <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
}
