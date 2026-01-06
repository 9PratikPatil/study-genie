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
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="card welcome-card" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
        color: 'white',
        border: 'none',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          borderRadius: '50%'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '2.5rem', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Welcome back, {user.username}! 🎓</h1>
          <p style={{ 
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.9)', 
            margin: 0, 
            lineHeight: '1.6',
            fontWeight: '400'
          }}>Ready to continue your learning journey with StudyGenie?</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="card" style={{ 
          height: 'fit-content',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '2.5rem'
        }}>
          <h2 style={{ 
            color: '#1e293b', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>📊 Recent Activity</h2>
          {loading ? (
            <div className="loading">Loading your history...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : history.length === 0 ? (
            <p>No activity yet. Start exploring StudyGenie features!</p>
          ) : (
            <div className="history-list" style={{
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {history.map((item) => (
                <div key={item.id} className="history-item" style={{
                  padding: '1.5rem',
                  border: 'none',
                  borderRadius: '16px',
                  marginBottom: '1rem',
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h4 style={{ margin: 0, textTransform: 'capitalize', fontSize: '0.9rem', fontWeight: '600' }}>
                      {item.feature_name.replace('-', ' ')}
                    </h4>
                    <small style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      {formatDate(item.created_at)}
                    </small>
                  </div>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {item.feature_name === 'chat' && item.prompt.message ? 
                      `"${item.prompt.message.substring(0, 80)}${item.prompt.message.length > 80 ? '...' : ''}"` :
                      `Used ${item.feature_name.replace('-', ' ')} feature`
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ 
          height: 'fit-content',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.9)',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '2.5rem'
        }}>
            <h2 style={{ 
              color: '#0f172a', 
              fontSize: '1.75rem', 
              fontWeight: '800',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              letterSpacing: '-0.025em'
            }}>🎆 All Features</h2>
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🧠</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>Study Style Quiz</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>Discover your learning preferences and optimize your study approach</p>
              </div>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>😰</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>Stress Check</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>Monitor your stress levels and get personalized recommendations</p>
              </div>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🗺️</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>GenieGuide</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>Get personalized study roadmaps tailored to your goals</p>
              </div>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💬</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>NOVA Chat</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>AI-powered study assistant for instant help and guidance</p>
              </div>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🤗</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>Support Coach</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>Emotional support and mental wellness guidance</p>
              </div>
              <div className="feature-card" style={{ 
                padding: '1.75rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🧘</div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem 0', fontWeight: '700', color: '#0f172a' }}>Rehab Tools</h3>
                <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.5', color: '#64748b' }}>Breathing exercises, journaling, and mindfulness practices</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Dashboard
