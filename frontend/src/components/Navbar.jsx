/**
 * Module: Navigation Bar Component
 * Responsibility: Main navigation with user info and logout
 * Inputs: user object, onLogout callback
 * Outputs: Navigation bar with links to all features
 * Notes: Responsive navigation for StudyGenie app
 */

import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/dashboard" className="nav-brand">
            🧞‍♂️ StudyGenie
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/study-style">Study Style</Link></li>
            <li><Link to="/stress-check">Stress Check</Link></li>
            <li><Link to="/genie-guide">GenieGuide</Link></li>
            <li><Link to="/nova-chat">NOVA Chat</Link></li>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/rehab">Rehab</Link></li>
            <li><Link to="/image-analysis">Image Analysis</Link></li>
          </ul>
          
          <div className="nav-user">
            <span>Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
