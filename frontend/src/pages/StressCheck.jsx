/**
 * Module: Stress Check Component
 * Responsibility: Stress level assessment based on lifestyle inputs
 * Inputs: User lifestyle and stress indicators
 * Outputs: Stress level classification with suggestions
 * Notes: Analyzes stress factors and provides coping recommendations
 */

import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const StressCheck = () => {
  const [formData, setFormData] = useState({
    sleepHours: '',
    workloadLevel: '',
    exerciseFrequency: '',
    socialSupport: '',
    financialConcerns: '',
    academicPressure: '',
    healthIssues: '',
    timeManagement: ''
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
      const response = await axios.post(`${API_URL}/ai/stress`, 
        { lifestyle: formData },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze stress level')
    } finally {
      setLoading(false)
    }
  }

  const getStressColor = (level) => {
    switch (level) {
      case 'Low': return '#059669'
      case 'Medium': return '#d97706'
      case 'High': return '#dc2626'
      default: return '#6b7280'
    }
  }

  if (result) {
    return (
      <div>
        <div className="card">
          <h2>Your Stress Assessment</h2>
          <div className="grid grid-2">
            <div>
              <h3 style={{ color: getStressColor(result.level) }}>
                Stress Level: {result.level}
              </h3>
              
              {result.drivers && result.drivers.length > 0 && (
                <div className="mt-2">
                  <h4>Main Stress Drivers:</h4>
                  <ul>
                    {result.drivers.map((driver, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>{driver}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <h4>Recommendations:</h4>
              <ul>
                {result.suggestions && result.suggestions.map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button 
            onClick={() => { setResult(null); setFormData({}); }} 
            className="btn btn-secondary mt-3"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Stress Level Check</h2>
      <p>Help us understand your current situation to assess your stress level and provide personalized recommendations.</p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="sleepHours">Average sleep hours per night</label>
            <select
              id="sleepHours"
              name="sleepHours"
              className="form-control"
              value={formData.sleepHours}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="less-than-5">Less than 5 hours</option>
              <option value="5-6">5-6 hours</option>
              <option value="7-8">7-8 hours</option>
              <option value="more-than-8">More than 8 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="workloadLevel">Current workload level</label>
            <select
              id="workloadLevel"
              name="workloadLevel"
              className="form-control"
              value={formData.workloadLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
              <option value="overwhelming">Overwhelming</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="exerciseFrequency">Exercise frequency</label>
            <select
              id="exerciseFrequency"
              name="exerciseFrequency"
              className="form-control"
              value={formData.exerciseFrequency}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="never">Never</option>
              <option value="rarely">Rarely (1-2 times/month)</option>
              <option value="sometimes">Sometimes (1-2 times/week)</option>
              <option value="regularly">Regularly (3+ times/week)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="socialSupport">Social support level</label>
            <select
              id="socialSupport"
              name="socialSupport"
              className="form-control"
              value={formData.socialSupport}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="none">No support</option>
              <option value="limited">Limited support</option>
              <option value="moderate">Moderate support</option>
              <option value="strong">Strong support system</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="financialConcerns">Financial concerns</label>
            <select
              id="financialConcerns"
              name="financialConcerns"
              className="form-control"
              value={formData.financialConcerns}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="none">No concerns</option>
              <option value="minor">Minor concerns</option>
              <option value="moderate">Moderate concerns</option>
              <option value="major">Major concerns</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="academicPressure">Academic pressure level</label>
            <select
              id="academicPressure"
              name="academicPressure"
              className="form-control"
              value={formData.academicPressure}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="healthIssues">Health concerns</label>
            <select
              id="healthIssues"
              name="healthIssues"
              className="form-control"
              value={formData.healthIssues}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="none">No health issues</option>
              <option value="minor">Minor health issues</option>
              <option value="moderate">Moderate health concerns</option>
              <option value="major">Major health concerns</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeManagement">Time management skills</label>
            <select
              id="timeManagement"
              name="timeManagement"
              className="form-control"
              value={formData.timeManagement}
              onChange={handleChange}
              required
            >
              <option value="">Select...</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze My Stress Level'}
        </button>
      </form>
    </div>
  )
}

export default StressCheck
