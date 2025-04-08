import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent drag and context menu events globally
document.addEventListener("dragstart", (e) => e.preventDefault(), false);
document.addEventListener("contextmenu", (e) => e.preventDefault(), false);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
