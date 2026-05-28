import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../components/Navbar'

describe('Navbar Component', () => {
  const mockUser = { name: 'Test User', role: 'CANDIDATE' }
  const mockOnLogout = vi.fn()
  const mockOnNavigate = vi.fn()

  it('renders brand name', () => {
    render(<Navbar user={mockUser} onLogout={mockOnLogout} currentPage="dashboard" onNavigate={mockOnNavigate} />)
    expect(screen.getByText(/AI Job Matcher/i)).toBeInTheDocument()
  })

  it('shows candidate links for candidate role', () => {
    render(<Navbar user={mockUser} onLogout={mockOnLogout} currentPage="dashboard" onNavigate={mockOnNavigate} />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/My CV/i)).toBeInTheDocument()
    expect(screen.getByText(/Matches/i)).toBeInTheDocument()
  })

  it('shows recruiter links for recruiter role', () => {
    const recruiter = { name: 'Recruiter', role: 'RECRUITER' }
    render(<Navbar user={recruiter} onLogout={mockOnLogout} currentPage="recruiter-dashboard" onNavigate={mockOnNavigate} />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Create Job/i)).toBeInTheDocument()
    expect(screen.getByText(/My Jobs/i)).toBeInTheDocument()
  })

  it('calls onNavigate when a link is clicked', () => {
    render(<Navbar user={mockUser} onLogout={mockOnLogout} currentPage="dashboard" onNavigate={mockOnNavigate} />)
    fireEvent.click(screen.getByText(/My CV/i))
    expect(mockOnNavigate).toHaveBeenCalledWith('cv')
  })

  it('calls onLogout when logout is clicked', () => {
    render(<Navbar user={mockUser} onLogout={mockOnLogout} currentPage="dashboard" onNavigate={mockOnNavigate} />)
    fireEvent.click(screen.getByText(/Logout/i))
    expect(mockOnLogout).toHaveBeenCalled()
  })
})
