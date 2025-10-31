import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import VoteButton from './VoteButton'
import LazyImage from './LazyImage'

const IssueCard = ({ issue, showVoting = true, compact = false }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'infrastructure':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      case 'safety':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'sanitation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  if (compact) {
    return (
      <div className="bg-white border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/issues/${issue.issue_id}`} className="flex-1">
            <h4 className="font-semibold text-secondary-900 hover:text-primary-600 line-clamp-1">
              {issue.title}
            </h4>
          </Link>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-secondary-600">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(issue.category)}
            <span>{issue.category}</span>
          </div>
          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-secondary-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {issue.image_url && (
        <div className="aspect-video overflow-hidden">
          <LazyImage
            src={issue.image_url}
            alt={`Image for ${issue.title}`}
            className="w-full h-full"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Link to={`/issues/${issue.issue_id}`} className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 mb-2">
              {issue.title}
            </h3>
          </Link>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>

        <p className="text-secondary-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {issue.description}
        </p>

        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center flex-wrap gap-3 text-sm text-secondary-500">
            <div className="flex items-center space-x-1">
              {getCategoryIcon(issue.category)}
              <span>{issue.category}</span>
            </div>
            
            {issue.location && (
              <div className="flex items-center space-x-1 min-w-0">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{issue.location}</span>
              </div>
            )}
            
            <span className="text-xs text-secondary-400 ml-auto">
              {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {showVoting && (
          <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
            <VoteButton issueId={issue.issue_id} />
            <Link
              to={`/issues/${issue.issue_id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default IssueCard