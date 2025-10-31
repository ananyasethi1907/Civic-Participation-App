const API_BASE_URL = 'http://localhost:8000'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Issues endpoints
  async getIssues(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/issues${queryString ? `?${queryString}` : ''}`)
  }

  async getIssue(id) {
    return this.request(`/issues/${id}`)
  }

  async createIssue(issueData) {
    return this.request('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    })
  }

  async updateIssueStatus(id, status) {
    return this.request(`/issues/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Votes endpoints
  async castVote(issueId, voteType) {
    return this.request('/votes', {
      method: 'POST',
      body: JSON.stringify({ issue_id: issueId, vote_type: voteType }),
    })
  }

  async getVoteCounts(issueId) {
    return this.request(`/issues/${issueId}/votes`)
  }

  // Feedback endpoints
  async addFeedback(issueId, message) {
    return this.request('/feedbacks', {
      method: 'POST',
      body: JSON.stringify({ issue_id: issueId, message }),
    })
  }

  async getIssueFeedbacks(issueId) {
    return this.request(`/issues/${issueId}/feedbacks`)
  }

  // Profile endpoints
  async getProfile() {
    return this.request('/profile')
  }

  async getNotifications() {
    return this.request('/notifications')
  }
}

export default new ApiService()