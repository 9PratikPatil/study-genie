/**
 * Module: Support Coach Component
 * Responsibility: Emotional support and guidance with non-clinical disclaimer
 * Inputs: User messages seeking support
 * Outputs: Empathetic responses with clear disclaimer
 * Notes: Always includes disclaimer about non-medical nature
 */

import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const SupportCoach = () => {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const result = await axios.post(`${API_URL}/ai/support`, 
        { message: message.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResponse(result.data)
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get support response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Disclaimer Banner */}
      <div style={{
        background: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem',
        color: '#92400e'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>⚠️ Important Disclaimer</h3>
        <p style={{ margin: 0 }}>
          This is a supportive educational tool, not medical care. If you are in crisis, please seek local emergency help or contact a mental health professional.
        </p>
      </div>

      <div className="card">
        <h2>Support Coach - Emotional Guidance</h2>
        <p>Share what's on your mind. I'm here to provide supportive, empathetic guidance for your academic and personal challenges.</p>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="message">What would you like to talk about?</label>
            <textarea
              id="message"
              className="form-control textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, concerns, or challenges. I'm here to listen and provide supportive guidance..."
              required
              style={{ minHeight: '120px' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !message.trim()}
          >
            {loading ? 'Getting Support...' : 'Get Support'}
          </button>
        </form>
      </div>

      {response && (
        <div className="card">
          <h3>Supportive Response</h3>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{response.response}</p>
          </div>
          
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            color: '#dc2626'
          }}>
            <strong>Reminder:</strong> {response.disclaimer}
          </div>
          
          <button 
            onClick={() => setResponse(null)} 
            className="btn btn-secondary mt-2"
          >
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  )
}

export default SupportCoach
