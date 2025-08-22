import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

// Error handling for production
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error('Root element not found');
  }
  
  createRoot(root).render(<App />);
} catch (error) {
  console.error('Failed to mount React app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error loading QUICKFIGMA</h1>
      <p>Please check the browser console for details.</p>
      <pre>${error.message}</pre>
    </div>
  `;
}
