import React, { useState, useEffect } from 'react'
import { matchingService, cvService, jobService, applicationService } from '../services/api'
import JobDetailsModal from './JobDetailsModal'

export default function CandidateDashboard({ user }) {
  const [topMatches, setTopMatches] = useState([])
  const [allMatchesCount, setAllMatchesCount] = useState(0)
  const [cvs, setCVs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [allMatchesRes, cvsRes, appsRes] = await Promise.all([
        matchingService.getMatches(user.id),
        cvService.getUserCVs(user.id),
        applicationService.getCandidateApplications(user.id)
      ])
      
      const allMatches = allMatchesRes.data
      setAllMatchesCount(allMatches.length)
      // On prend exactement les 5 premiers de la liste "Matches"
      setTopMatches(allMatches.slice(0, 5))
      setCVs(cvsRes.data)
      setApplications(appsRes.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    try {
      await applicationService.apply(user.id, jobId)
      alert('Application submitted successfully!')
      fetchData() // Refresh data
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply')
    }
  }

  const handleViewDetails = async (match) => {
    try {
      const response = await jobService.getJobOffer(match.jobId)
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
          <h3>{applications.length}</h3>
          <p>Jobs Applied</p>
        </div>
        <div className="stat-card">
          <h3>{allMatchesCount}</h3>
          <p>Matches Found</p>
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

               <div style={{ marginTop: '15px', textAlign: 'right' }}>
                 <button 
                   className="btn" 
                   style={{ backgroundColor: '#f5f5f5' }}
                   onClick={() => handleViewDetails(match)}
                 >
                   View Full Details
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
