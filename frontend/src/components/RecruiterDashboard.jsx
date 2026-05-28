import React, { useState, useEffect } from 'react'
import { jobService, matchingService } from '../services/api'

export default function RecruiterDashboard({ user }) {
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobCandidates, setJobCandidates] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobsRes, candidatesRes] = await Promise.all([
        jobService.getRecruiterJobOffers(user.id),
        matchingService.getRecruiterCandidates(user.id)
      ])
      setJobs(jobsRes.data)
      setCandidates(candidatesRes.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (job) => {
    try {
      setSelectedJob(job)
      const response = await matchingService.getJobCandidates(job.id)
      setJobCandidates(response.data)
    } catch (err) {
      console.error('Failed to load job candidates', err)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job offer?')) {
      try {
        await jobService.deleteJobOffer(jobId)
        fetchData()
      } catch (err) {
        setError('Failed to delete job')
      }
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="container">
      <h2>Welcome, {user.name}!</h2>
      {error && <div className="error">{error}</div>}

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Active Job Offers</p>
        </div>
        <div className="stat-card">
          <h3>{candidates.length}</h3>
          <p>Total Matches</p>
        </div>
        <div className="stat-card">
          <h3>{candidates.filter(c => c.score >= 80).length}</h3>
          <p>Top Candidates (80%+)</p>
        </div>
      </div>

      {selectedJob ? (
        <div className="card">
          <button className="btn" onClick={() => setSelectedJob(null)} style={{ marginBottom: '20px' }}>
            &larr; Back to Dashboard
          </button>
          <h3>Candidates for: {selectedJob.title}</h3>
          {jobCandidates.length === 0 ? (
            <p>No candidates found for this job yet.</p>
          ) : (
            <div className="candidates-list">
              {jobCandidates.map((candidate) => (
                <div key={candidate.matchId} className="job-card card" style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>{candidate.candidateName}</h4>
                      <p><strong>Email:</strong> {candidate.candidateEmail}</p>
                    </div>
                    <div className="score-badge" style={{ 
                      backgroundColor: candidate.score >= 80 ? '#27ae60' : candidate.score >= 50 ? '#f39c12' : '#e74c3c',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontWeight: 'bold'
                    }}>
                      {Math.round(candidate.score)}% Match
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <strong>Matched Skills:</strong>
                    <div className="skills-list">
                      {candidate.matchedSkills && JSON.parse(candidate.matchedSkills).map((skill, idx) => (
                        <span key={idx} className="skill-tag matched">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h3>Your Job Offers</h3>
          {jobs.length === 0 ? (
            <p>No job offers yet. Create one to get started!</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="job-card card" style={{ marginBottom: '15px' }}>
                <h4>{job.title}</h4>
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p style={{ color: '#666', marginTop: '10px' }}>
                  {job.description.substring(0, 150)}...
                </p>
                <div style={{ marginTop: '10px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '10px' }}
                    onClick={() => handleViewDetails(job)}
                  >
                    View Candidates
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

