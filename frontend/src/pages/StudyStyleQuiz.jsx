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
    // Visual Learning Questions
    { id: 1, text: "I understand information better when it's presented in charts, graphs, or diagrams", type: "visual" },
    { id: 2, text: "I prefer textbooks with lots of pictures, illustrations, and visual examples", type: "visual" },
    { id: 3, text: "I like to use different colored pens/highlighters to organize my notes", type: "visual" },
    { id: 4, text: "I can easily remember faces but sometimes forget names", type: "visual" },
    { id: 5, text: "I prefer to sit in the front of the classroom to see everything clearly", type: "visual" },
    { id: 6, text: "Mind maps and flowcharts help me organize complex information", type: "visual" },
    
    // Auditory Learning Questions
    { id: 7, text: "I learn better when someone explains concepts to me verbally", type: "auditory" },
    { id: 8, text: "I often read aloud or move my lips when reading silently", type: "auditory" },
    { id: 9, text: "I enjoy participating in class discussions and group conversations", type: "auditory" },
    { id: 10, text: "I can remember song lyrics and melodies easily", type: "auditory" },
    { id: 11, text: "I prefer listening to lectures rather than reading textbooks", type: "auditory" },
    { id: 12, text: "I talk through problems out loud to help me understand them", type: "auditory" },
    
    // Kinesthetic Learning Questions
    { id: 13, text: "I learn best through hands-on activities and experiments", type: "kinesthetic" },
    { id: 14, text: "I need to take frequent breaks when studying for long periods", type: "kinesthetic" },
    { id: 15, text: "I prefer to walk around or move while thinking through problems", type: "kinesthetic" },
    { id: 16, text: "I understand concepts better when I can physically manipulate objects", type: "kinesthetic" },
    { id: 17, text: "I enjoy lab work, field trips, and practical applications", type: "kinesthetic" },
    { id: 18, text: "I often use gestures and body language when explaining things", type: "kinesthetic" },
    
    // Mixed Learning Preferences
    { id: 19, text: "I prefer studying in a quiet environment without distractions", type: "visual" },
    { id: 20, text: "I learn better when I can discuss the material with study partners", type: "auditory" },
    { id: 21, text: "I like to write and rewrite notes to help me remember information", type: "kinesthetic" },
    { id: 22, text: "Video tutorials are more effective for me than written instructions", type: "visual" },
    { id: 23, text: "I remember information better when I create my own examples", type: "kinesthetic" },
    { id: 24, text: "I prefer background music while studying to help me concentrate", type: "auditory" }
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
      <div className="quiz-container">
        <div className="quiz-results">
          <div className="result-header">
            <h2 className="result-title">🎉 Your Learning Style Profile</h2>
            <p style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '2rem', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Congratulations! Here's your personalized learning style analysis.
            </p>
            
            <div style={{ marginBottom: '2rem' }}>
              <span className="learning-style-badge">Primary: {result.primary}</span>
              {result.secondary && (
                <span className="learning-style-badge" style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                }}>
                  Secondary: {result.secondary}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ 
                color: '#ffffff', 
                marginBottom: '1.5rem',
                fontSize: '1.4rem',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}>📊 Style Breakdown</h3>
              
              {result.probabilities && (
                <div>
                  {Object.entries(result.probabilities).map(([style, percentage]) => (
                    <div key={style} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ 
                          textTransform: 'capitalize', 
                          fontWeight: '700',
                          color: '#ffffff',
                          fontSize: '1rem',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>
                          {style === 'visual' && '👁️'} 
                          {style === 'auditory' && '👂'} 
                          {style === 'kinesthetic' && '✋'} 
                          {style}
                        </span>
                        <span style={{ 
                          fontWeight: '700',
                          color: '#ffffff',
                          fontSize: '1.1rem',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                        }}>{percentage}%</span>
                      </div>
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="tips-section">
              <h3 style={{ 
                color: '#1f2937', 
                marginBottom: '1.5rem',
                fontSize: '1.4rem',
                fontWeight: '700'
              }}>💡 Personalized Study Tips</h3>
              
              <ul className="tips-list">
                {result.tips && result.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => { setResult(null); setAnswers({}); }} 
              className="btn btn-secondary"
              style={{ 
                fontSize: '1.1rem', 
                padding: '1rem 2rem',
                marginRight: '1rem'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>🔄</span>
              Take Quiz Again
            </button>
            
            <button 
              onClick={() => window.print()} 
              className="btn btn-primary"
              style={{ 
                fontSize: '1.1rem', 
                padding: '1rem 2rem'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>📄</span>
              Save Results
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progress = (Object.keys(answers).length / questions.length) * 100

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 style={{ 
          fontSize: '2.2rem', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem'
        }}>🧠 Study Style Discovery Quiz</h2>
        <p style={{ fontSize: '1.1rem', color: '#374151', lineHeight: '1.6', fontWeight: '500' }}>
          Discover your unique learning preferences through our comprehensive assessment. 
          Rate each statement from 1 (strongly disagree) to 5 (strongly agree).
        </p>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          {Object.keys(answers).length} of {questions.length} questions completed ({Math.round(progress)}%)
        </div>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} className="quiz-question">
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className="question-number">{question.id}</span>
              <div className="question-text">{question.text}</div>
            </div>
            
            <div className="quiz-options">
              <span className="option-label">Strongly Disagree</span>
              
              <div className="radio-group">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="custom-radio">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={value}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      required
                    />
                    <div className="radio-button">{value}</div>
                  </label>
                ))}
              </div>
              
              <span className="option-label">Strongly Agree</span>
            </div>
          </div>
        ))}
        
        <div className="quiz-submit">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || Object.keys(answers).length < questions.length}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {loading ? (
              <>
                <span style={{ marginRight: '0.5rem' }}>🔄</span>
                Analyzing Your Learning Style...
              </>
            ) : (
              <>
                <span style={{ marginRight: '0.5rem' }}>✨</span>
                Discover My Learning Style
              </>
            )}
          </button>
          
          {Object.keys(answers).length < questions.length && (
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
              Please answer all questions to get your personalized results
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default StudyStyleQuiz
