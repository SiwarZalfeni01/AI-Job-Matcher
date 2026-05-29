import React from 'react'

export default function JobDetailsModal({ job, onClose, onApply, isApplied, applicationStatus }) {
  if (!job) return null

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '5px' }}>{job.jobTitle || job.title}</h2>
          <p style={{ fontSize: '1.2rem', color: '#3498db', fontWeight: 'bold' }}>{job.companyName}</p>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '30px' }}>
          <div className="stat-card">
            <h4 style={{ color: '#7f8c8d' }}>Location</h4>
            <p>{job.location || 'Not specified'}</p>
          </div>
          <div className="stat-card">
            <h4 style={{ color: '#7f8c8d' }}>Salary</h4>
            <p>{job.salaryRange || 'Not specified'}</p>
          </div>
          <div className="stat-card">
            <h4 style={{ color: '#7f8c8d' }}>Match Score</h4>
            <div className={`score-badge ${job.score >= 80 ? 'score-high' : job.score >= 50 ? 'score-medium' : 'score-low'}`} style={{ marginTop: '5px' }}>
              {Math.round(job.score)}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginTop: '10px' }}>
            {job.description}
          </p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3>Analysis of your Skills</h3>
          <div style={{ marginTop: '15px' }}>
            <strong>Matched Skills:</strong>
            {renderSkills(job.matchedSkills, true)}
          </div>
          <div style={{ marginTop: '15px' }}>
            <strong>Missing Skills:</strong>
            {renderSkills(job.missingSkills, false)}
          </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'right' }}>
          {isApplied ? (
            <span className="status-badge" style={{ 
              padding: '10px 20px', 
              borderRadius: '25px', 
              backgroundColor: '#e1f5fe', 
              color: '#0288d1',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              Application Status: {applicationStatus}
            </span>
          ) : (
            <button 
              className="btn btn-primary btn-large" 
              style={{ padding: '12px 40px', fontSize: '1.1rem' }}
              onClick={() => onApply(job.jobId || job.id)}
            >
              Apply for this Position
            </button>
          )}
          <button 
            className="btn" 
            style={{ marginLeft: '15px', padding: '12px 25px', backgroundColor: '#f5f5f5' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
