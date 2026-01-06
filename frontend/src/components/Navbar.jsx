/**
 * Module: Sidebar Navigation Component
 * Responsibility: Left sidebar navigation with user info and logout
 * Inputs: user object, onLogout callback
 * Outputs: Sidebar with links to all features
 * Notes: Modern sidebar navigation for StudyGenie app
 */

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/study-style', icon: '🧠', label: 'Study Style' },
    { path: '/stress-check', icon: '😰', label: 'Stress Check' },
    { path: '/genie-guide', icon: '🗺️', label: 'GenieGuide' },
    { path: '/nova-chat', icon: '💬', label: 'NOVA Chat' },
    { path: '/support', icon: '🤗', label: 'Support' },
    { path: '/rehab', icon: '🧘', label: 'Rehab' }
  ]

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <span className="brand-icon">🧞‍♂️</span>
          {!isCollapsed && <span className="brand-text">StudyGenie</span>}
        </Link>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
            title={isCollapsed ? item.label : ''}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
          </Link>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-status">Online</span>
            </div>
          )}
        </div>
        <button 
          onClick={onLogout} 
          className="sidebar-logout"
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="logout-icon">🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
