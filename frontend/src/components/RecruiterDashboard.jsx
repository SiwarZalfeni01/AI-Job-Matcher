import React, { useState, useEffect } from 'react'
import { jobService, matchingService, applicationService } from '../services/api'

export default function RecruiterDashboard({ user }) {
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobCandidates, setJobCandidates] = useState([])
  const [viewMode, setViewMode] = useState('dashboard') // 'dashboard', 'job-details', 'applications'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobsRes, candidatesRes, appsRes] = await Promise.all([
        jobService.getRecruiterJobOffers(user.id),
        matchingService.getRecruiterCandidates(user.id),
        applicationService.getRecruiterApplications(user.id)
      ])
      setJobs(jobsRes.data)
      setCandidates(candidatesRes.data)
      setApplications(appsRes.data)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus)
      fetchData()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleViewDetails = async (job) => {
    try {
      setSelectedJob(job)
      setViewMode('job-details')
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome, {user.name}!</h2>
        <div className="tabs">
          <button 
            className={`btn ${viewMode === 'dashboard' ? 'btn-primary' : ''}`} 
            onClick={() => setViewMode('dashboard')}
          >
            Jobs
          </button>
          <button 
            className={`btn ${viewMode === 'applications' ? 'btn-primary' : ''}`} 
            onClick={() => setViewMode('applications')}
            style={{ marginLeft: '10px' }}
          >
            Applications ({applications.filter(a => a.status === 'PENDING').length})
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>{jobs.length}</h3>
          <p>Active Job Offers</p>
        </div>
        <div className="stat-card">
          <h3>{applications.length}</h3>
          <p>Total Applications</p>
        </div>
        <div className="stat-card">
          <h3>{candidates.filter(c => c.score >= 80).length}</h3>
          <p>Top Potential Matches</p>
        </div>
      </div>

      {viewMode === 'job-details' && selectedJob && (
        <div className="card">
          <button className="btn" onClick={() => setViewMode('dashboard')} style={{ marginBottom: '20px' }}>
            &larr; Back to Jobs
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'applications' && (
        <div className="card">
          <button className="btn" onClick={() => setViewMode('dashboard')} style={{ marginBottom: '20px' }}>
            &larr; Back to Jobs
          </button>
          <h3>Incoming Applications</h3>
          {applications.length === 0 ? (
            <p>No applications received yet.</p>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="job-card card" style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4>{app.candidateName} applied for {app.jobTitle}</h4>
                      <p><strong>Email:</strong> {app.candidateEmail}</p>
                      <p><strong>Date:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> 
                        <span style={{ 
                          marginLeft: '10px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: app.status === 'ACCEPTED' ? '#d4edda' : app.status === 'REJECTED' ? '#f8d7da' : '#fff3cd',
                          color: app.status === 'ACCEPTED' ? '#155724' : app.status === 'REJECTED' ? '#721c24' : '#856404'
                        }}>
                          {app.status}
                        </span>
                      </p>
                    </div>
                    <div className="actions">
                      <select 
                        value={app.status} 
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="btn"
                        style={{ padding: '5px' }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="ACCEPTED">Accept</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === 'dashboard' && (
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
                    View Potential Candidates
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


