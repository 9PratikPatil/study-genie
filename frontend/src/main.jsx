/**
 * Module: React Application Entry Point
 * Responsibility: Initialize React app with routing
 * Inputs: DOM root element
 * Outputs: Rendered React application
 * Notes: Main entry point for StudyGenie frontend
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
