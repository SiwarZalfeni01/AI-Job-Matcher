import React, { useState, useEffect } from 'react'
import { matchingService, cvService } from '../services/api'

export default function CandidateDashboard({ user }) {
  const [topMatches, setTopMatches] = useState([])
  const [allMatchesCount, setAllMatchesCount] = useState(0)
  const [cvs, setCVs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [topMatchesRes, allMatchesRes, cvsRes] = await Promise.all([
        matchingService.getTopMatches(user.id, 5),
        matchingService.getMatches(user.id),
        cvService.getUserCVs(user.id)
      ])
      setTopMatches(topMatchesRes.data)
      setAllMatchesCount(allMatchesRes.data.length)
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

  const renderSkills = (skillsJson, isMatched) => {
    try {
      const skills = skillsJson ? JSON.parse(skillsJson) : []
      if (!Array.isArray(skills) || skills.length === 0) return <p style={{ color: '#999' }}>None</p>
      
      return (
        <div className="skills-list">
          {skills.map((skill, idx) => (
            <span key={idx} className={`skill-tag ${isMatched ? 'matched' : 'missing'}`}>
              {skill}
            </span>
          ))}
        </div>
      )
    } catch (e) {
      return <p style={{ color: '#999' }}>None</p>
    }
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
          <h3>{allMatchesCount}</h3>
          <p>Total Job Matches</p>
        </div>
        <div className="stat-card">
          <h3>{topMatches.length > 0 ? Math.round(topMatches[0].score) : 0}%</h3>
          <p>Best Match Score</p>
        </div>
      </div>

      <div className="card">
        <h3>Top 5 Recommendations</h3>
        {topMatches.length === 0 ? (
          <p>No matches yet. Upload your CV to get started!</p>
        ) : (
          topMatches.map((match) => (
            <div key={match.id} className="job-card card" style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4>{match.jobTitle}</h4>
                  <p><strong>Company:</strong> {match.companyName}</p>
                </div>
                <span className={`score-badge ${getScoreBadgeClass(match.score)}`}>
                  {Math.round(match.score)}% Match
                </span>
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <strong>Matched Skills:</strong>
                {renderSkills(match.matchedSkills, true)}
              </div>
              
              <div style={{ marginTop: '10px' }}>
                <strong>Missing Skills:</strong>
                {renderSkills(match.missingSkills, false)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
