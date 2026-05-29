import React from 'react'

export default function Navbar({ user, onLogout, currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>🔥 Khademni</h1>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ul className="navbar-links">
              {user.role === 'CANDIDATE' && (
                <>
                  <li>
                    <a onClick={() => onNavigate('dashboard')} style={{ fontWeight: currentPage === 'dashboard' ? 'bold' : 'normal' }}>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a onClick={() => onNavigate('cv')} style={{ fontWeight: currentPage === 'cv' ? 'bold' : 'normal' }}>
                      My CV
                    </a>
                  </li>
                  <li>
                    <a onClick={() => onNavigate('matches')} style={{ fontWeight: currentPage === 'matches' ? 'bold' : 'normal' }}>
                      Matches
                    </a>
                  </li>
                </>
              )}
              {user.role === 'RECRUITER' && (
                <>
                  <li>
                    <a onClick={() => onNavigate('recruiter-dashboard')} style={{ fontWeight: currentPage === 'recruiter-dashboard' ? 'bold' : 'normal' }}>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a onClick={() => onNavigate('create-job')} style={{ fontWeight: currentPage === 'create-job' ? 'bold' : 'normal' }}>
                      Create Job
                    </a>
                  </li>
                  <li>
                    <a onClick={() => onNavigate('my-jobs')} style={{ fontWeight: currentPage === 'my-jobs' ? 'bold' : 'normal' }}>
                      My Jobs
                    </a>
                  </li>
                </>
              )}
              <li>
                <a onClick={onLogout} style={{ color: '#e74c3c' }}>
                  Logout ({user.name})
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
