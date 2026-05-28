import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Login from '../components/Login'
import { authService } from '../services/api'

// Mock the api service
vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('Login Component', () => {
  const mockOnLoginSuccess = vi.fn()
  const mockOnSwitchToRegister = vi.fn()

  it('renders login form', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} onSwitchToRegister={mockOnSwitchToRegister} />)
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  it('updates input values on change', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} onSwitchToRegister={mockOnSwitchToRegister} />)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  it('calls login service and onLoginSuccess on successful login', async () => {
    const mockResponse = { data: { token: 'fake-token', email: 'test@example.com' } }
    authService.login.mockResolvedValue(mockResponse)

    render(<Login onLoginSuccess={mockOnLoginSuccess} onSwitchToRegister={mockOnSwitchToRegister} />)
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockResponse.data)
    })
  })

  it('shows error message on login failure', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    })

    render(<Login onLoginSuccess={mockOnLoginSuccess} onSwitchToRegister={mockOnSwitchToRegister} />)
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('calls onSwitchToRegister when register link is clicked', () => {
    render(<Login onLoginSuccess={mockOnLoginSuccess} onSwitchToRegister={mockOnSwitchToRegister} />)
    fireEvent.click(screen.getByText(/Register here/i))
    expect(mockOnSwitchToRegister).toHaveBeenCalled()
  })
})
