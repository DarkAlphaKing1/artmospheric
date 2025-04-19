import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from '/App.js';
import { reportWebVitals } from './WebVitals'; // Correctly import Web Vitals.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log Web Vitals metrics for debugging or send them to an analytics endpoint.
reportWebVitals((metric) => {
    console.log(metric); // Replace with your analytics logic if needed.
});
