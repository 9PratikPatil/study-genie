/**
 * Module: Main App Component
 * Responsibility: Root component with routing and authentication context
 * Inputs: Browser routing
 * Outputs: Rendered application with navigation
 * Notes: Handles authentication state and protected routes
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import StudyStyleQuiz from './pages/StudyStyleQuiz'
import StressCheck from './pages/StressCheck'
import GenieGuide from './pages/GenieGuide'
import NovaChat from './pages/NovaChat'
import SupportCoach from './pages/SupportCoach'
import Rehab from './pages/Rehab'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route 
                path="/login" 
                element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
              />
              <Route 
                path="/signup" 
                element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} 
              />
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/study-style" 
                element={user ? <StudyStyleQuiz /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/stress-check" 
                element={user ? <StressCheck /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/genie-guide" 
                element={user ? <GenieGuide /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/nova-chat" 
                element={user ? <NovaChat /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/support" 
                element={user ? <SupportCoach /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/rehab" 
                element={user ? <Rehab /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/" 
                element={<Navigate to={user ? "/dashboard" : "/login"} />} 
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
