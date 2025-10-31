import { useState, useEffect } from 'react'
import IssueCard from '../components/ui/IssueCard'
import apiService from '../services/api'

const AdminDashboard = () => {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const data = await apiService.getIssues()
      setIssues(data)
      
      // Calculate stats
      const stats = data.reduce((acc, issue) => {
        acc.total++
        switch (issue.status.toLowerCase()) {
          case 'pending':
            acc.pending++
            break
          case 'in progress':
            acc.inProgress++
            break
          case 'resolved':
            acc.resolved++
            break
        }
        return acc
      }, { total: 0, pending: 0, inProgress: 0, resolved: 0 })
      
      setStats(stats)
    } catch (error) {
      console.error('Failed to fetch issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await apiService.updateIssueStatus(issueId, newStatus)
      // Refresh issues
      await fetchIssues()
    } catch (error) {
      console.error('Failed to update issue status:', error)
    }
  }

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true
    return issue.status.toLowerCase() === filter.toLowerCase()
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-secondary-600">
          Manage and track community issues
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-secondary-900">{stats.total}</div>
              <div className="text-sm text-secondary-600">Total Issues</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-secondary-900">{stats.pending}</div>
              <div className="text-sm text-secondary-600">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-secondary-900">{stats.inProgress}</div>
              <div className="text-sm text-secondary-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-secondary-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-secondary-900">{stats.resolved}</div>
              <div className="text-sm text-secondary-600">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-secondary-100 p-1 rounded-lg w-fit">
        {['pending', 'in progress', 'resolved', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            {status === 'all' ? 'All Issues' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <div key={issue.issue_id} className="bg-white rounded-lg border border-secondary-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {issue.image_url && (
                    <img
                      src={issue.image_url}
                      alt={issue.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      {issue.title}
                    </h3>
                    <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span>{issue.category}</span>
                      <span>{issue.location}</span>
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={issue.status}
                  onChange={(e) => updateIssueStatus(issue.issue_id, e.target.value)}
                  className="px-3 py-1 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No {filter} issues found
          </h3>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard