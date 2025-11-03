import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Imports your App.jsx file

// This finds the '<div id="root"></div>' in your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// This tells React to render your <App /> component inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
