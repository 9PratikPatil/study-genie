/**
 * Module: Rehab Tools Component
 * Responsibility: Wellness tools including breathing timer and journal
 * Inputs: User interactions with breathing exercises and journal entries
 * Outputs: Guided breathing sessions and persistent journaling
 * Notes: Includes breathing timer with cycles and localStorage journal
 */

import React, { useState, useEffect } from 'react'

const Rehab = () => {
  const [activeTab, setActiveTab] = useState('breathing')
  
  return (
    <div>
      <div className="card">
        <h2>Rehab Tools - Wellness & Recovery</h2>
        <p>Take care of your mental health with breathing exercises and reflective journaling.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'breathing' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('breathing')}
          >
            🫁 Breathing Timer
          </button>
          <button 
            className={`btn ${activeTab === 'journal' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('journal')}
          >
            📝 Journal
          </button>
        </div>
        
        {activeTab === 'breathing' && <BreathingTimer />}
        {activeTab === 'journal' && <Journal />}
      </div>
    </div>
  )
}

const BreathingTimer = () => {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  
  const phases = {
    inhale: { duration: 4, next: 'hold', text: 'Breathe In', color: '#059669' },
    hold: { duration: 4, next: 'exhale', text: 'Hold', color: '#d97706' },
    exhale: { duration: 6, next: 'inhale', text: 'Breathe Out', color: '#2563eb' }
  }

  useEffect(() => {
    let interval = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phases[phase]
      const nextPhase = currentPhase.next
      
      setPhase(nextPhase)
      setTimeLeft(phases[nextPhase].duration)
      
      if (nextPhase === 'inhale') {
        setCycle(cycle + 1)
      }
    }
    
    return () => clearInterval(interval)
  }, [isActive, timeLeft, phase, cycle])

  const startTimer = () => {
    setIsActive(true)
    setPhase('inhale')
    setTimeLeft(4)
    setCycle(0)
  }

  const stopTimer = () => {
    setIsActive(false)
    setTimeLeft(4)
    setPhase('inhale')
  }

  const currentPhaseData = phases[phase]

  return (
    <div>
      <h3>4-4-6 Breathing Exercise</h3>
      <p>Follow the guided breathing pattern: 4 seconds in, 4 seconds hold, 6 seconds out.</p>
      
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: '#f9fafb',
        borderRadius: '12px',
        margin: '2rem 0'
      }}>
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: currentPhaseData.color,
          margin: '0 auto 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 'bold',
          transition: 'all 0.5s ease'
        }}>
          {timeLeft}
        </div>
        
        <h2 style={{ color: currentPhaseData.color, marginBottom: '1rem' }}>
          {currentPhaseData.text}
        </h2>
        
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Cycle: {cycle}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!isActive ? (
            <button onClick={startTimer} className="btn btn-success">
              Start Breathing Exercise
            </button>
          ) : (
            <button onClick={stopTimer} className="btn btn-danger">
              Stop Exercise
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const Journal = () => {
  const [entry, setEntry] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    // Load saved entries from localStorage
    const savedEntries = localStorage.getItem('studygenie-journal')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntry = () => {
    if (!entry.trim()) return

    const newEntry = {
      id: Date.now(),
      content: entry.trim(),
      timestamp: new Date().toISOString()
    }

    const updatedEntries = [newEntry, ...entries]
    setEntries(updatedEntries)
    localStorage.setItem('studygenie-journal', JSON.stringify(updatedEntries))
    setEntry('')
  }

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('studygenie-journal', JSON.stringify(updatedEntries))
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <h3>Personal Journal</h3>
      <p>Write down your thoughts, feelings, and reflections. Your entries are saved locally on your device.</p>
      
      <div className="form-group">
        <label htmlFor="journalEntry">New Journal Entry</label>
        <textarea
          id="journalEntry"
          className="form-control textarea"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What's on your mind today? How are you feeling about your studies? Any challenges or victories to reflect on?"
          style={{ minHeight: '150px' }}
        />
      </div>
      
      <button 
        onClick={saveEntry} 
        className="btn btn-primary mb-3"
        disabled={!entry.trim()}
      >
        Save Entry
      </button>
      
      <div>
        <h4>Previous Entries ({entries.length})</h4>
        {entries.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
            No journal entries yet. Start writing to track your thoughts and progress!
          </p>
        ) : (
          <div>
            {entries.map((journalEntry) => (
              <div key={journalEntry.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                background: '#ffffff'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <small style={{ color: '#6b7280' }}>
                    {formatDate(journalEntry.timestamp)}
                  </small>
                  <button 
                    onClick={() => deleteEntry(journalEntry.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                    title="Delete entry"
                  >
                    ×
                  </button>
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {journalEntry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rehab
