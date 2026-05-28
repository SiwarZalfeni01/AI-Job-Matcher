import React, { useState } from 'react'
import { jobService } from '../services/api'

export default function CreateJobOffer({ user, onJobCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requiredSkills, setRequiredSkills] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [location, setLocation] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title || !description || !companyName) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      // Convert CSV skills string to JSON array
      const skillsArray = requiredSkills
        ? requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : []
      const response = await jobService.createJobOffer(user.id, {
        title,
        description,
        requiredSkills: JSON.stringify(skillsArray),
        companyName,
        location,
        salaryRange
      })
      setSuccess('Job offer created successfully!')
      setTitle('')
      setDescription('')
      setRequiredSkills('')
      setCompanyName('')
      setLocation('')
      setSalaryRange('')
      if (onJobCreated) onJobCreated(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job offer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Create Job Offer</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Java Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Tech Corp"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="form-group">
            <label>Salary Range</label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g., $80,000 - $120,000"
            />
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job responsibilities, requirements, and benefits..."
              required
            />
          </div>

          <div className="form-group">
            <label>Required Skills (comma-separated)</label>
            <input
              type="text"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              placeholder="e.g., Java, Spring Boot, MySQL, Docker"
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Creating...' : 'Create Job Offer'}
          </button>
        </form>
      </div>
    </div>
  )
}
