import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIssues } from '../hooks/useIssues'
import IssueCard from '../components/ui/IssueCard'
import Sidebar from '../components/layout/Sidebar'

const Issues = () => {
  const [filter, setFilter] = useState('all')
  const { data: issues = [], isLoading, error } = useIssues(
    filter === 'all' ? {} : { status: filter }
  )

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
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
        <h1 className="text-3xl font-bold text-secondary-900">
          Community Issues
        </h1>
        <Link to="/issues/create" className="btn-primary">
          Report New Issue
        </Link>
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
            {status === 'all' ? 'All Issues' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Issues Grid */}
      {error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">Error loading issues</h3>
          <p className="text-secondary-600">{error.message}</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No issues found</h3>
          <p className="text-secondary-600">
            {filter === 'all' 
              ? 'No issues have been reported yet.' 
              : `No ${filter} issues found.`
            }
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {issues.map((issue, index) => (
            <motion.div
              key={issue.issue_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <IssueCard issue={issue} />
            </motion.div>
          ))}
        </motion.div>
      )}
      </div>
    </div>
  )
}

export default Issues