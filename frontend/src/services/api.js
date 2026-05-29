import axios from 'axios'

const API_BASE_URL = 'http://localhost:8085/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // If the data is FormData, let the browser set the Content-Type with the boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  
  return config
})

// Auth Service
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// CV Service
export const cvService = {
  uploadCV: (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/cv/upload/${userId}`, formData)
  },
  addCV: (userId, data) => api.post(`/cv/add/${userId}`, data),
  getUserCVs: (userId) => api.get(`/cv/user/${userId}`),
  getCV: (userId, cvId) => api.get(`/cv/${userId}/${cvId}`),
  deleteCV: (userId, cvId) => api.delete(`/cv/${userId}/${cvId}`)
}

// Job Offer Service
export const jobService = {
  createJobOffer: (recruiterId, data) => api.post(`/jobs/create/${recruiterId}`, data),
  getAllJobOffers: () => api.get('/jobs/all'),
  getRecruiterJobOffers: (recruiterId) => api.get(`/jobs/recruiter/${recruiterId}`),
  getJobOffer: (jobId) => api.get(`/jobs/${jobId}`),
  updateJobOffer: (jobId, data) => api.put(`/jobs/${jobId}`, data),
  deleteJobOffer: (jobId) => api.delete(`/jobs/${jobId}`)
}

// Matching Service
export const matchingService = {
  getMatches: (userId) => api.get(`/matching/matches/${userId}`),
  getTopMatches: (userId, limit = 10) => api.get(`/matching/top-matches/${userId}`, { params: { limit } }),
  getJobCandidates: (jobId) => api.get(`/matching/job-candidates/${jobId}`),
  getRecruiterCandidates: (recruiterId) => api.get(`/matching/recruiter-candidates/${recruiterId}`)
}

// Application Service
export const applicationService = {
  apply: (userId, jobId) => api.post(`/applications/apply/${userId}/${jobId}`),
  getCandidateApplications: (userId) => api.get(`/applications/candidate/${userId}`),
  getRecruiterApplications: (recruiterId) => api.get(`/applications/recruiter/${recruiterId}`),
  updateStatus: (applicationId, status) => api.patch(`/applications/${applicationId}/status`, null, { params: { status } })
}

export default api
