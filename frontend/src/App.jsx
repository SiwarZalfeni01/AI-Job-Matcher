import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import CandidateDashboard from './components/CandidateDashboard'
import CVManager from './components/CVManager'
import MatchesList from './components/MatchesList'
import RecruiterDashboard from './components/RecruiterDashboard'
import CreateJobOffer from './components/CreateJobOffer'

export default function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login')
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // Set the correct dashboard page based on user role
      setCurrentPage(userData.role === 'CANDIDATE' ? 'dashboard' : 'recruiter-dashboard')
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setCurrentPage(userData.role === 'CANDIDATE' ? 'dashboard' : 'recruiter-dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('login')
    setAuthMode('login')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const renderContent = () => {
    if (!user) {
      if (authMode === 'login') {
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        )
      } else {
        return (
          <Register
            onRegisterSuccess={handleLoginSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <CandidateDashboard user={user} />
      case 'cv':
        return <CVManager user={user} />
      case 'matches':
        return <MatchesList user={user} />
      case 'recruiter-dashboard':
        return <RecruiterDashboard user={user} />
      case 'create-job':
        return <CreateJobOffer user={user} onJobCreated={() => handleNavigate('my-jobs')} />
      case 'my-jobs':
        return <RecruiterDashboard user={user} />
      default:
        return <CandidateDashboard user={user} />
    }
  }

  return (
    <div>
      {user && <Navbar user={user} onLogout={handleLogout} currentPage={currentPage} onNavigate={handleNavigate} />}
      {renderContent()}
    </div>
  )
}
