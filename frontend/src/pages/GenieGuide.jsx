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
    weeklyHours: '',
    currentLevel: '',
    learningGoals: '',
    timeframe: '',
    studyPreference: '',
    priorKnowledge: '',
    challengeAreas: ''
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
            onClick={() => { 
              setResult(null); 
              setFormData({ 
                courseInfo: '', 
                weeklyHours: '', 
                currentLevel: '', 
                learningGoals: '', 
                timeframe: '', 
                studyPreference: '', 
                priorKnowledge: '', 
                challengeAreas: '' 
              }); 
            }} 
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
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="courseInfo">Course/Subject Information</label>
            <textarea
              id="courseInfo"
              name="courseInfo"
              className="form-control textarea"
              value={formData.courseInfo}
              onChange={handleChange}
              placeholder="Describe your course, subject, or topic (e.g., 'Introduction to Python Programming', 'Advanced Calculus', 'World History 1900-2000')..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="learningGoals">Specific Learning Goals</label>
            <textarea
              id="learningGoals"
              name="learningGoals"
              className="form-control textarea"
              value={formData.learningGoals}
              onChange={handleChange}
              placeholder="What do you want to achieve? (e.g., 'Pass final exam with 85%+', 'Build a web application', 'Understand key historical events')..."
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="currentLevel">Current Knowledge Level</label>
            <select
              id="currentLevel"
              name="currentLevel"
              className="form-control"
              value={formData.currentLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select your level...</option>
              <option value="complete-beginner">Complete Beginner</option>
              <option value="some-basics">Know Some Basics</option>
              <option value="intermediate">Intermediate Level</option>
              <option value="advanced">Advanced Level</option>
              <option value="expert-review">Expert (Just Reviewing)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeframe">Target Completion Time</label>
            <select
              id="timeframe"
              name="timeframe"
              className="form-control"
              value={formData.timeframe}
              onChange={handleChange}
              required
            >
              <option value="">Select timeframe...</option>
              <option value="2-weeks">2 weeks</option>
              <option value="1-month">1 month</option>
              <option value="2-months">2 months</option>
              <option value="3-months">3 months</option>
              <option value="6-months">6 months</option>
              <option value="1-year">1 year or more</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="weeklyHours">Weekly Study Hours Available</label>
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
          
          <div className="form-group">
            <label htmlFor="studyPreference">Preferred Study Method</label>
            <select
              id="studyPreference"
              name="studyPreference"
              className="form-control"
              value={formData.studyPreference}
              onChange={handleChange}
              required
            >
              <option value="">Select preference...</option>
              <option value="reading-notes">Reading & Note-taking</option>
              <option value="video-tutorials">Video Tutorials</option>
              <option value="hands-on-practice">Hands-on Practice</option>
              <option value="group-discussion">Group Discussion</option>
              <option value="mixed-approach">Mixed Approach</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priorKnowledge">Related Knowledge/Experience</label>
            <textarea
              id="priorKnowledge"
              name="priorKnowledge"
              className="form-control textarea"
              value={formData.priorKnowledge}
              onChange={handleChange}
              placeholder="Any related courses, skills, or experience you have that might help? (Optional)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="challengeAreas">Expected Challenge Areas</label>
            <textarea
              id="challengeAreas"
              name="challengeAreas"
              className="form-control textarea"
              value={formData.challengeAreas}
              onChange={handleChange}
              placeholder="What topics or skills do you expect to find most challenging? (Optional)"
            />
          </div>
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
