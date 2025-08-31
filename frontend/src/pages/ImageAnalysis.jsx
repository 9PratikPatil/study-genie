/**
 * Module: Image Analysis Component
 * Responsibility: Upload and analyze images using AI
 * Inputs: Image files from user upload
 * Outputs: Image labels with confidence scores
 * Notes: Integrates with Hugging Face API for image recognition
 */

import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ImageAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/ai/image-analyze`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image')
    } finally {
      setLoading(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  return (
    <div className="card">
      <h2>Image Analysis</h2>
      <p>Upload an image to get AI-powered labels and object recognition. Great for analyzing study materials, diagrams, or any visual content.</p>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="imageUpload">Select Image</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleFileSelect}
          className="form-control"
        />
      </div>

      {preview && (
        <div style={{ marginBottom: '2rem' }}>
          <h4>Image Preview:</h4>
          <img 
            src={preview} 
            alt="Preview" 
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
        </div>
      )}

      {selectedFile && !result && (
        <button 
          onClick={handleUpload}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Analyzing Image...' : 'Analyze Image'}
        </button>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Analysis Results</h3>
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem'
          }}>
            <h4>Detected Objects/Labels:</h4>
            {result.labels && result.labels.length > 0 ? (
              <div>
                {result.labels.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: index < result.labels.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{item.label}</span>
                    <span style={{
                      background: '#2563eb',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.875rem'
                    }}>
                      {Math.round(item.score * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No labels detected in the image.</p>
            )}
          </div>
          
          <button 
            onClick={resetAnalysis}
            className="btn btn-secondary mt-3"
          >
            Analyze Another Image
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageAnalysis
