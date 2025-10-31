// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root container not found. Make sure index.html contains <div id="root"></div>');
}

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
