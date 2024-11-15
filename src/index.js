// src/index.js

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import process from 'process';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Setup globals after imports
window.Buffer = Buffer;
window.process = process;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
