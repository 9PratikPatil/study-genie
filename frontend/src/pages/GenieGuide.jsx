/**
 * Module: GenieGuide Component
 * Responsibility: Course roadmap and mindmap generation
 * Inputs: Course information and weekly study hours
 * Outputs: Structured roadmap with weekly topics and mindmap visualization
 * Notes: Creates personalized study plans based on course details
 */

import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const GenieGuide = () => {
  const [formData, setFormData] = useState({
    courseInfo: '',
    weeklyHours: ''
  })
  const [result, setResult] = useState(null)
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
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/ai/genieguide`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate study guide')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div>
        <div className="card">
          <h2>Your Personalized Study Roadmap</h2>
          
          <div className="grid grid-2">
            <div>
              <h3>Weekly Study Plan</h3>
              {result.roadmap && result.roadmap.map((week) => (
                <div key={week.week} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <h4>Week {week.week}</h4>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Topics:</strong>
                    <ul style={{ margin: '0.25rem 0' }}>
                      {week.topics.map((topic, index) => (
                        <li key={index}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Activities:</strong>
                    <ul style={{ margin: '0.25rem 0' }}>
                      {week.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h3>Concept Mindmap</h3>
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem',
                minHeight: '200px'
              }}>
                <p style={{ lineHeight: '1.6' }}>{result.mindmap}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => { setResult(null); setFormData({ courseInfo: '', weeklyHours: '' }); }} 
            className="btn btn-secondary mt-3"
          >
            Create New Roadmap
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>GenieGuide - Study Roadmap Creator</h2>
      <p>Get a personalized study roadmap and mindmap for your course. Provide details about what you're studying and how much time you can dedicate each week.</p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseInfo">Course Information</label>
          <textarea
            id="courseInfo"
            name="courseInfo"
            className="form-control textarea"
            value={formData.courseInfo}
            onChange={handleChange}
            placeholder="Describe your course, subject, or topic you want to study. Include any specific areas you want to focus on, difficulty level, or learning objectives..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="weeklyHours">Weekly Study Hours</label>
          <select
            id="weeklyHours"
            name="weeklyHours"
            className="form-control"
            value={formData.weeklyHours}
            onChange={handleChange}
            required
          >
            <option value="">Select weekly hours...</option>
            <option value="1-3">1-3 hours per week</option>
            <option value="4-6">4-6 hours per week</option>
            <option value="7-10">7-10 hours per week</option>
            <option value="11-15">11-15 hours per week</option>
            <option value="16-20">16-20 hours per week</option>
            <option value="20+">More than 20 hours per week</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Your Roadmap...' : 'Generate Study Roadmap'}
        </button>
      </form>
    </div>
  )
}

export default GenieGuide
