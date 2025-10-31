// src/components/edit.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";

export default function EditUser({ user, onSave, onCancel }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPassword(user?.password || "");
  }, [user]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { id: user.id, name: name.trim(), email: email.trim(), password };
    onSave(payload);
    // parent will clear editUser
  };

  return (
    <Modal title={`Edit User #${user.id}`} onClose={onCancel}>
      <form onSubmit={submit}>
        <div className="modal-field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="modal-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="modal-field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="modal-actions">
          <button className="btn" type="submit">Save</button>
          <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
