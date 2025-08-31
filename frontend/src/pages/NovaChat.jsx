/**
 * Module: NOVA Chat Component
 * Responsibility: AI study assistant chat interface
 * Inputs: User messages and questions
 * Outputs: AI responses for study assistance
 * Notes: Interactive chat with study context awareness
 */

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const NovaChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m NOVA, your AI study assistant. How can I help you with your studies today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/ai/chat`, 
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get response')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <h2>NOVA Chat - AI Study Assistant</h2>
      <p>Ask me anything about your studies, get explanations, or request study tips!</p>
      
      {error && <div className="error">{error}</div>}
      
      <div style={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        background: '#f9fafb'
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            background: message.role === 'user' ? '#2563eb' : '#ffffff',
            color: message.role === 'user' ? 'white' : '#333',
            marginLeft: message.role === 'user' ? '20%' : '0',
            marginRight: message.role === 'user' ? '0' : '20%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              {message.role === 'user' ? 'You' : 'NOVA'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
          </div>
        ))}
        
        {loading && (
          <div style={{
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#ffffff',
            marginRight: '20%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              NOVA
            </div>
            <div>Thinking...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="form-control"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me about your studies..."
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !inputMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default NovaChat
