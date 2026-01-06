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
  const [category, setCategory] = useState('')
  const [urgency, setUrgency] = useState('')
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
        { 
          message: message.trim(),
          category: category,
          urgency: urgency
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResponse(result.data)
      setMessage('')
      setCategory('')
      setUrgency('')
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
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="category">What area would you like support with?</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category...</option>
                <option value="academic-stress">Academic Stress & Pressure</option>
                <option value="exam-anxiety">Test/Exam Anxiety</option>
                <option value="time-management">Time Management & Procrastination</option>
                <option value="motivation">Lack of Motivation</option>
                <option value="social-issues">Social & Relationship Issues</option>
                <option value="self-esteem">Self-Esteem & Confidence</option>
                <option value="life-balance">Work-Life Balance</option>
                <option value="future-concerns">Future & Career Concerns</option>
                <option value="family-pressure">Family Expectations & Pressure</option>
                <option value="general-support">General Emotional Support</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="urgency">How urgent is this concern?</label>
              <select
                id="urgency"
                name="urgency"
                className="form-control"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                required
              >
                <option value="">Select urgency level...</option>
                <option value="low">Low - General guidance needed</option>
                <option value="medium">Medium - Affecting daily activities</option>
                <option value="high">High - Significantly impacting well-being</option>
                <option value="crisis">Crisis - Need immediate support resources</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Tell me more about your situation</label>
            <textarea
              id="message"
              className="form-control textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, feelings, and specific challenges. The more details you provide, the better I can support you. Remember, this is a safe space to express yourself..."
              required
              style={{ minHeight: '150px' }}
            />
          </div>
          
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#0c4a6e'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e' }}>💡 Helpful Prompts</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Consider sharing: What triggered this feeling? How long has this been affecting you? 
              What have you tried so far? What would feeling better look like to you?
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !message.trim() || !category || !urgency}
          >
            {loading ? 'Getting Support...' : 'Get Support & Guidance'}
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
            onClick={() => {
              setResponse(null)
              setMessage('')
              setCategory('')
              setUrgency('')
            }} 
            className="btn btn-secondary mt-2"
          >
            Get More Support
          </button>
        </div>
      )}
    </div>
  )
}

export default SupportCoach
