/**
 * Module: Study Style Quiz Component
 * Responsibility: Learning style assessment with Likert scale questions
 * Inputs: User responses to quiz questions
 * Outputs: Learning style profile with tips and recommendations
 * Notes: Determines visual, auditory, or kinesthetic learning preferences
 */

import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const StudyStyleQuiz = () => {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const questions = [
    { id: 1, text: "I prefer to learn by reading and looking at diagrams", type: "visual" },
    { id: 2, text: "I remember information better when I hear it explained", type: "auditory" },
    { id: 3, text: "I learn best when I can practice hands-on activities", type: "kinesthetic" },
    { id: 4, text: "I like to take detailed notes with colors and highlights", type: "visual" },
    { id: 5, text: "I enjoy group discussions and verbal explanations", type: "auditory" },
    { id: 6, text: "I need to move around while studying to stay focused", type: "kinesthetic" },
    { id: 7, text: "Charts and graphs help me understand complex information", type: "visual" },
    { id: 8, text: "I prefer listening to podcasts or audio recordings", type: "auditory" },
    { id: 9, text: "I like to build models or use manipulatives to learn", type: "kinesthetic" },
    { id: 10, text: "I can easily visualize concepts in my mind", type: "visual" }
  ]

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: parseInt(value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions')
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/ai/study-style`, 
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze study style')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div>
        <div className="card">
          <h2>Your Learning Style Profile</h2>
          <div className="grid grid-2">
            <div>
              <h3>Primary Style: {result.primary}</h3>
              <h4>Secondary Style: {result.secondary}</h4>
              
              {result.probabilities && (
                <div className="mt-2">
                  <h4>Style Breakdown:</h4>
                  {Object.entries(result.probabilities).map(([style, percentage]) => (
                    <div key={style} style={{ marginBottom: '0.5rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{style}: {percentage}%</span>
                      <div style={{
                        background: '#e5e7eb',
                        height: '8px',
                        borderRadius: '4px',
                        marginTop: '2px'
                      }}>
                        <div style={{
                          background: '#2563eb',
                          height: '100%',
                          width: `${percentage}%`,
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h4>Personalized Tips:</h4>
              <ul>
                {result.tips && result.tips.map((tip, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button 
            onClick={() => { setResult(null); setAnswers({}); }} 
            className="btn btn-secondary mt-3"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Study Style Quiz</h2>
      <p>Answer these questions to discover your learning preferences. Rate each statement from 1 (strongly disagree) to 5 (strongly agree).</p>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} className="form-group">
            <label>{question.id}. {question.text}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <span>Strongly Disagree</span>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={value}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    required
                  />
                  {value}
                </label>
              ))}
              <span>Strongly Agree</span>
            </div>
          </div>
        ))}
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze My Learning Style'}
        </button>
      </form>
    </div>
  )
}

export default StudyStyleQuiz
