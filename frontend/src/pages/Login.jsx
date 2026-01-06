/**
 * Module: Login Page Component
 * Responsibility: User authentication form
 * Inputs: onLogin callback function
 * Outputs: Login form with validation and error handling
 * Notes: Handles user login with JWT token storage
 */

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData)
      onLogin(response.data.user, response.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="card" style={{ 
        maxWidth: '600px', 
        width: '100%',
        margin: '0 auto', 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.9)',
        border: 'none',
        padding: '4rem'
      }}>
        <div className="text-center mb-4">
          <h1 style={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            letterSpacing: '-0.025em'
          }}>Welcome to StudyGenie</h1>
          <p style={{ color: '#64748b', fontSize: '1.3rem', fontWeight: '400', lineHeight: '1.6' }}>Sign in to your account and continue your learning journey</p>
        </div>
      
      {error && <div className="error">{error}</div>}
      
        <form onSubmit={handleSubmit} style={{ marginTop: '3rem' }}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="username" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: '#0f172a',
              marginBottom: '0.75rem',
              display: 'block'
            }}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                padding: '1rem 1.25rem',
                fontSize: '1.1rem',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label htmlFor="password" style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: '#0f172a',
              marginBottom: '0.75rem',
              display: 'block'
            }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                padding: '1rem 1.25rem',
                fontSize: '1.1rem',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                width: '100%'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              width: '100%',
              padding: '1.25rem 2rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      
        <p className="text-center" style={{ marginTop: '2rem', fontSize: '1.1rem', color: '#64748b' }}>
          Don't have an account? <Link to="/signup" style={{ 
            color: '#6366f1', 
            textDecoration: 'none', 
            fontWeight: '600',
            transition: 'color 0.3s ease'
          }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
