import React, { useState, useEffect } from 'react'
import { matchingService } from '../services/api'

export default function MatchesList({ user }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('score')

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await matchingService.getMatches(user.id)
      setMatches(response.data)
    } catch (err) {
      setError('Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'score-high'
    if (score >= 50) return 'score-medium'
    return 'score-low'
  }

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score
    return a.jobTitle.localeCompare(b.jobTitle)
  })

  if (loading) return <div className="loading">Loading matches...</div>

  return (
    <div className="container">
      <h2>Job Matches</h2>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Found {matches.length} Matches</h3>
          <div>
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="score">Score (High to Low)</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>
        </div>

        {matches.length === 0 ? (
          <p>No matches found. Upload your CV to get started!</p>
        ) : (
          sortedMatches.map((match) => (
            <div key={match.id} className="job-card card" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4>{match.jobTitle}</h4>
                  <p><strong>Company:</strong> {match.companyName}</p>
                </div>
                <span className={`score-badge ${getScoreBadgeClass(match.score)}`}>
                  {Math.round(match.score)}%
                </span>
              </div>

              <div style={{ marginTop: '15px' }}>
                {(() => {
                  try {
                    const matchedSkills = match.matchedSkills ? JSON.parse(match.matchedSkills) : [];
                    const skillsArray = Array.isArray(matchedSkills) ? matchedSkills : [];
                    return (
                      <>
                        <strong>Matched Skills ({skillsArray.length}):</strong>
                        <div className="skills-list">
                          {skillsArray.length > 0 ? (
                            skillsArray.map((skill, idx) => (
                              <span key={idx} className="skill-tag matched">{skill}</span>
                            ))
                          ) : (
                            <p style={{ color: '#999' }}>No matched skills</p>
                          )}
                        </div>
                      </>
                    );
                  } catch (e) {
                    return <p style={{ color: '#999' }}>No matched skills</p>;
                  }
                })()}
              </div>

              <div style={{ marginTop: '15px' }}>
                {(() => {
                  try {
                    const missingSkills = match.missingSkills ? JSON.parse(match.missingSkills) : [];
                    const skillsArray = Array.isArray(missingSkills) ? missingSkills : [];
                    return (
                      <>
                        <strong>Missing Skills ({skillsArray.length}):</strong>
                        <div className="skills-list">
                          {skillsArray.length > 0 ? (
                            skillsArray.map((skill, idx) => (
                              <span key={idx} className="skill-tag missing">{skill}</span>
                            ))
                          ) : (
                            <p style={{ color: '#999' }}>All required skills matched!</p>
                          )}
                        </div>
                      </>
                    );
                  } catch (e) {
                    return <p style={{ color: '#999' }}>All required skills matched!</p>;
                  }
                })()}
              </div>

              <button className="btn btn-primary" style={{ marginTop: '15px' }}>
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
