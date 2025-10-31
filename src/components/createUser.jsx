// src/components/createUser.jsx
import React, { useState } from "react";
import Modal from "./Modal";

export default function CreateUser({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const payload = { name: name.trim(), email: email.trim(), password };
    onCreate(payload);
    // clear inputs
    setName(""); setEmail(""); setPassword("");
    // ask parent to close (parent typically sets showCreate false)
    if (typeof onCancel === "function") onCancel();
  };

  return (
    <Modal title="Create User" onClose={onCancel}>
      <form onSubmit={submit}>
        <div className="modal-field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" />
        </div>

        <div className="modal-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
        </div>

        <div className="modal-field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Choose a password" />
        </div>

        <div className="modal-actions">
          <button className="btn" type="submit">Create</button>
          <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
