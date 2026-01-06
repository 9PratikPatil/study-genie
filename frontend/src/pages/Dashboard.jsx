/**
 * Module: Dashboard Page Component
 * Responsibility: Main user dashboard with welcome and recent history
 * Inputs: user object
 * Outputs: Dashboard with user greeting and last 10 history items
 * Notes: Entry point after login showing user activity
 */

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Dashboard = ({ user }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHistory(response.data.history.slice(0, 10))
    } catch (err) {
      setError('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="card welcome-card">
        <h1>Welcome back, {user.username}! 🎓</h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Ready to continue your learning journey with StudyGenie?</p>
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        {loading ? (
          <div className="loading">Loading your history...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : history.length === 0 ? (
          <p>No activity yet. Start exploring StudyGenie features!</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item" style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, textTransform: 'capitalize' }}>
                    {item.feature_name.replace('-', ' ')}
                  </h4>
                  <small style={{ color: '#6b7280' }}>
                    {formatDate(item.created_at)}
                  </small>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', color: '#4b5563' }}>
                  {item.feature_name === 'chat' && item.prompt.message ? 
                    `"${item.prompt.message.substring(0, 100)}${item.prompt.message.length > 100 ? '...' : ''}"` :
                    `Used ${item.feature_name.replace('-', ' ')} feature`
                  }
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-3">
        <div className="feature-card">
          <h3>🧠 Study Style Quiz</h3>
          <p>Discover your learning preferences and optimize your study approach</p>
        </div>
        <div className="feature-card">
          <h3>😰 Stress Check</h3>
          <p>Monitor your stress levels and get personalized recommendations</p>
        </div>
        <div className="feature-card">
          <h3>🗺️ GenieGuide</h3>
          <p>Get personalized study roadmaps tailored to your goals</p>
        </div>
        <div className="feature-card">
          <h3>💬 NOVA Chat</h3>
          <p>AI-powered study assistant for instant help and guidance</p>
        </div>
        <div className="feature-card">
          <h3>🤗 Support Coach</h3>
          <p>Emotional support and mental wellness guidance</p>
        </div>
        <div className="feature-card">
          <h3>🧘 Rehab Tools</h3>
          <p>Breathing exercises, journaling, and mindfulness practices</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
