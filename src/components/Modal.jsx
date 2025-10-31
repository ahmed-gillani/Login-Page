// src/components/Modal.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";


export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const overlay = (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
      role="presentation"
      aria-hidden="false"
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title" style={{ margin: 0 }}>{title}</h3>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
