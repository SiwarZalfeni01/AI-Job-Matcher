import React, { useState, useEffect } from 'react'
import { matchingService, cvService } from '../services/api'

export default function CandidateDashboard({ user }) {
  const [matches, setMatches] = useState([])
  const [cvs, setCVs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [matchesRes, cvsRes] = await Promise.all([
        matchingService.getTopMatches(user.id, 5),
        cvService.getUserCVs(user.id)
      ])
      setMatches(matchesRes.data)
      setCVs(cvsRes.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-high'
    if (score >= 50) return 'score-medium'
    return 'score-low'
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>
      {error && <div className="error">{error}</div>}

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>{cvs.length}</h3>
          <p>CVs Uploaded</p>
        </div>
        <div className="stat-card">
          <h3>{matches.length}</h3>
          <p>Top Matches</p>
        </div>
        <div className="stat-card">
          <h3>{matches.length > 0 ? Math.round(matches[0].score) : 0}%</h3>
          <p>Best Match Score</p>
        </div>
      </div>

      <div className="card">
        <h3>Top Job Matches</h3>
        {matches.length === 0 ? (
          <p>No matches yet. Upload your CV to get started!</p>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="job-card card" style={{ marginBottom: '15px' }}>
              <h4>{match.jobTitle}</h4>
              <p><strong>Company:</strong> {match.companyName}</p>
              <p>
                <strong>Match Score:</strong>{' '}
                <span className={`score-badge ${getScoreBadgeClass(match.score)}`}>
                  {Math.round(match.score)}%
                </span>
              </p>
              <div>
                <strong>Matched Skills:</strong>
                <div className="skills-list">
                  {match.matchedSkills && JSON.parse(match.matchedSkills).map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong>Missing Skills:</strong>
                <div className="skills-list">
                  {match.missingSkills && JSON.parse(match.missingSkills).map((skill, idx) => (
                    <span key={idx} className="skill-tag missing">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
