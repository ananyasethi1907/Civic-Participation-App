import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import Sidebar from '../components/layout/Sidebar'

const IssueDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [issue, setIssue] = useState(null)
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0, total_votes: 0 })
  const [feedbacks, setFeedbacks] = useState([])
  const [newFeedback, setNewFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  useEffect(() => {
    fetchIssueData()
  }, [id])

  const fetchIssueData = async () => {
    try {
      const [issueData, votesData, feedbacksData] = await Promise.all([
        apiService.getIssue(id),
        apiService.getVoteCounts(id),
        apiService.getIssueFeedbacks(id)
      ])
      setIssue(issueData)
      setVotes(votesData)
      setFeedbacks(feedbacksData)
    } catch (error) {
      console.error('Failed to fetch issue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (voteType) => {
    if (!isAuthenticated) return
    
    try {
      await apiService.castVote(id, voteType)
      // Refresh vote counts
      const votesData = await apiService.getVoteCounts(id)
      setVotes(votesData)
    } catch (error) {
      console.error('Failed to cast vote:', error)
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!newFeedback.trim() || !isAuthenticated) return

    setSubmittingFeedback(true)
    try {
      await apiService.addFeedback(id, newFeedback)
      setNewFeedback('')
      // Refresh feedbacks
      const feedbacksData = await apiService.getIssueFeedbacks(id)
      setFeedbacks(feedbacksData)
    } catch (error) {
      console.error('Failed to add feedback:', error)
    } finally {
      setSubmittingFeedback(false)
    }
  }

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

  if (!issue) {
    return (
      <div className="app-grid">
        <Sidebar />
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Issue not found</h2>
          <p className="text-secondary-600">The issue you're looking for doesn't exist.</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">{votes.upvotes}</div>
                <div className="text-sm text-secondary-600">Upvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-900">{votes.downvotes}</div>
                <div className="text-sm text-secondary-600">Downvotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{votes.total_votes}</div>
                <div className="text-sm text-secondary-600">Total Votes</div>
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVote('Upvote')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Upvote</span>
                </button>
                <button
                  onClick={() => handleVote('Downvote')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>Downvote</span>
                </button>
              </div>
            )}
          </div>
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
                disabled={!newFeedback.trim() || submittingFeedback}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingFeedback ? 'Posting...' : 'Post Comment'}
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
            {feedbacks.map((feedback) => (
              <div key={feedback.feedback_id} className="bg-secondary-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium text-secondary-900">
                    {feedback.citizens?.name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-secondary-500">
                    {new Date(feedback.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-secondary-700">{feedback.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default IssueDetail