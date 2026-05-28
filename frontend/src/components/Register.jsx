import React, { useState } from 'react'
import { authService } from '../services/api'

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('CANDIDATE')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.register({ email, password, name, role })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      onRegisterSuccess(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CANDIDATE">Candidate</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account?{' '}
          <a onClick={onSwitchToLogin} style={{ cursor: 'pointer', color: '#3498db' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}
