import React, { useState, useEffect } from 'react'
import { matchingService, applicationService, jobService } from '../services/api'
import JobDetailsModal from './JobDetailsModal'

export default function MatchesList({ user }) {
  const [matches, setMatches] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState('score')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const [matchesRes, appsRes] = await Promise.all([
        matchingService.getMatches(user.id),
        applicationService.getCandidateApplications(user.id)
      ])
      setMatches(matchesRes.data)
      setApplications(appsRes.data)
    } catch (err) {
      setError('Failed to load matches')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    try {
      await applicationService.apply(user.id, jobId)
      alert('Application submitted successfully!')
      fetchMatches() // Refresh applications list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  const handleViewDetails = async (match) => {
    try {
      const response = await jobService.getJobOffer(match.jobId)
      // Merge match details (scores, skills) with full job details (description, salary)
      const fullJobData = {
        ...response.data,
        ...match
      }
      setSelectedJob(fullJobData)
      setIsModalOpen(true)
    } catch (err) {
      alert('Failed to load job details')
    }
  }

  const isApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId)
  }

  const getApplicationStatus = (jobId) => {
    const app = applications.find(app => app.jobId === jobId)
    return app ? app.status : null
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

              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {isApplied(match.jobId) ? (
                    <span className="status-badge" style={{ 
                      padding: '5px 12px', 
                      borderRadius: '15px', 
                      backgroundColor: '#e1f5fe', 
                      color: '#0288d1',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      Applied: {getApplicationStatus(match.jobId)}
                    </span>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleApply(match.jobId)}
                    >
                      Apply Now
                    </button>
                  )}
                 </div>
                 <button 
                   className="btn" 
                   style={{ backgroundColor: '#f5f5f5' }}
                   onClick={() => handleViewDetails(match)}
                 >
                   View Details
                 </button>
               </div>
             </div>
           ))
         )}
       </div>

       {isModalOpen && selectedJob && (
         <JobDetailsModal 
           job={selectedJob} 
           onClose={() => setIsModalOpen(false)}
           onApply={handleApply}
           isApplied={isApplied(selectedJob.jobId)}
           applicationStatus={getApplicationStatus(selectedJob.jobId)}
         />
       )}
     </div>
   )
 }
