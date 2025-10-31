import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import IssueCard from '../components/ui/IssueCard'
import apiService from '../services/api'
import Sidebar from '../components/layout/Sidebar'

const MyReports = () => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMyIssues()
  }, [])

  const fetchMyIssues = async () => {
    try {
      // This would need to be implemented in the API
      const allIssues = await apiService.getIssues()
      // Filter by current user (this should be done on backend)
      const myIssues = allIssues.filter(issue => issue.created_by === user?.id)
      setIssues(myIssues)
    } catch (error) {
      console.error('Failed to fetch my issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIssues = issues.filter(issue => {
    if (filter === 'all') return true
    return issue.status.toLowerCase() === filter.toLowerCase()
  })

  const getStatusCount = (status) => {
    if (status === 'all') return issues.length
    return issues.filter(issue => issue.status.toLowerCase() === status.toLowerCase()).length
  }

  if (loading) {
    return (
      <div className="app-grid">
        <Sidebar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-grid fade-in">
      <Sidebar />
      <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            My Reports
          </h1>
          <p className="text-secondary-600">
            Track the status of issues you've reported
          </p>
        </div>
        <Link to="/issues/create" className="btn-primary">
          Report New Issue
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-secondary-900">{getStatusCount('all')}</div>
          <div className="text-sm text-secondary-600">Total Reports</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</div>
          <div className="text-sm text-secondary-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-blue-600">{getStatusCount('in progress')}</div>
          <div className="text-sm text-secondary-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-secondary-200">
          <div className="text-2xl font-bold text-green-600">{getStatusCount('resolved')}</div>
          <div className="text-sm text-secondary-600">Resolved</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-secondary-100 p-1 rounded-lg w-fit">
        {['all', 'pending', 'in progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            {status === 'all' ? 'All Reports' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs bg-secondary-200 px-2 py-1 rounded-full">
              {getStatusCount(status)}
            </span>
          </button>
        ))}
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            {filter === 'all' ? 'No reports yet' : `No ${filter} reports`}
          </h3>
          <p className="text-secondary-600 mb-4">
            {filter === 'all' 
              ? "You haven't reported any issues yet. Start by reporting your first issue!"
              : `You don't have any ${filter} reports.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/issues/create" className="btn-primary">
              Report Your First Issue
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue) => (
            <IssueCard 
              key={issue.issue_id} 
              issue={issue} 
              showVoting={false}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  )
}

export default MyReports