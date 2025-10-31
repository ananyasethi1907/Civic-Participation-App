import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIssue, useIssueFeedbacks, useAddFeedback } from '../hooks/useIssues'
import VoteButton from '../components/ui/VoteButton'
import Sidebar from '../components/layout/Sidebar'

const IssueDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [newFeedback, setNewFeedback] = useState('')
  
  console.log('Issue ID from params:', id)
  
  const { data: issue, isLoading: issueLoading, error: issueError } = useIssue(id)
  const { data: feedbacks = [], isLoading: feedbacksLoading } = useIssueFeedbacks(id)
  const addFeedbackMutation = useAddFeedback()

  console.log('Issue data:', issue)
  console.log('Issue loading:', issueLoading)
  console.log('Issue error:', issueError)
  console.log('Feedbacks:', feedbacks)

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    
    if (!newFeedback.trim()) return

    try {
      await addFeedbackMutation.mutateAsync({
        issueId: id,
        message: newFeedback
      })
      setNewFeedback('')
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const loading = issueLoading || feedbacksLoading

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

  if (issueError || !issue) {
    return (
      <div className="app-grid">
        <Sidebar />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Issue not found</h2>
          <p className="text-secondary-600">
            {issueError ? issueError.message : "The issue you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-grid fade-in">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        {/* Issue Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-secondary-900 mb-3">
              {issue.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-secondary-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {issue.location || 'Location not specified'}
              </span>
              <span>{issue.category}</span>
              <span>{new Date(issue.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
            {issue.status}
          </span>
        </div>

        {/* Issue Image */}
        {issue.image_url && (
          <img
            src={issue.image_url}
            alt={issue.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        {/* Issue Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-3">Description</h3>
          <p className="text-secondary-700 leading-relaxed">{issue.description}</p>
        </div>

        {/* Voting Section */}
        <div className="border-t border-secondary-200 pt-6">
          <VoteButton issueId={id} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">
          Community Feedback ({feedbacks.length})
        </h3>

        {/* Add Feedback Form */}
        {isAuthenticated && (
          <form onSubmit={handleFeedbackSubmit} className="mb-8">
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Share your thoughts about this issue..."
              className="input-field resize-none"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!newFeedback.trim() || addFeedbackMutation.isPending}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addFeedbackMutation.isPending ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        )}

        {/* Feedback List */}
        {feedbacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-secondary-600">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => {
              const citizenName = feedback.citizens 
                ? (Array.isArray(feedback.citizens) ? feedback.citizens[0]?.name : feedback.citizens.name)
                : 'Anonymous'
              
              return (
                <div key={feedback.feedback_id} className="bg-secondary-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-secondary-900">
                      {citizenName}
                    </span>
                    <span className="text-sm text-secondary-500">
                      {new Date(feedback.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-secondary-700">{feedback.message}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default IssueDetail