import React, { useState, useEffect } from 'react'
import { cvService } from '../services/api'

export default function CVManager({ user }) {
  const [cvs, setCVs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [file, setFile] = useState(null)
  const [content, setContent] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    fetchCVs()
  }, [])

  const fetchCVs = async () => {
    try {
      setLoading(true)
      const response = await cvService.getUserCVs(user.id)
      setCVs(response.data)
    } catch (err) {
      setError('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFile = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await cvService.uploadCV(user.id, file)
      setSuccess('CV uploaded successfully!')
      setFile(null)
      fetchCVs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload CV')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCV = async (e) => {
    e.preventDefault()
    if (!content || !fileName) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')
      await cvService.addCV(user.id, { content, fileName })
      setSuccess('CV added successfully!')
      setContent('')
      setFileName('')
      fetchCVs()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add CV')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCV = async (cvId) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        setLoading(true)
        await cvService.deleteCV(user.id, cvId)
        setSuccess('CV deleted successfully!')
        fetchCVs()
      } catch (err) {
        setError('Failed to delete CV')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="container">
      <h2>CV Manager</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>Upload CV File</h3>
        <form onSubmit={handleUploadFile}>
          <div className="form-group">
            <label>Select PDF or Text File</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload CV'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Add CV Text</h3>
        <form onSubmit={handleAddCV}>
          <div className="form-group">
            <label>CV Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., My CV 2024"
            />
          </div>
          <div className="form-group">
            <label>CV Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your CV content here..."
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add CV'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>My CVs</h3>
        {cvs.length === 0 ? (
          <p>No CVs uploaded yet.</p>
        ) : (
          cvs.map((cv) => (
            <div key={cv.id} className="card" style={{ marginBottom: '15px', borderLeft: '4px solid #3498db' }}>
              <h4>{cv.fileName}</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Created: {new Date(cv.createdAt).toLocaleDateString()}
              </p>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                <strong>Extracted Skills:</strong> {
                  cv.extractedSkills
                    ? (() => {
                        try {
                          const skills = JSON.parse(cv.extractedSkills);
                          return Array.isArray(skills) && skills.length > 0 ? skills.join(', ') : 'None';
                        } catch (e) {
                          return 'None';
                        }
                      })()
                    : 'None'
                }
              </p>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteCV(cv.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
