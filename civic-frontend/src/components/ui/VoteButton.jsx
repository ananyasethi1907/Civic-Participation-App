import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useVoteCounts, useUserVote, useCastVote } from '../../hooks/useIssues'

const VoteButton = ({ issueId, size = 'sm' }) => {
  const { isAuthenticated, user } = useAuth()
  const { data: votes = { upvotes: 0, downvotes: 0, total_votes: 0 } } = useVoteCounts(issueId)
  const { data: userVote } = useUserVote(issueId, user?.id)
  const castVoteMutation = useCastVote()

  const handleVote = (voteType) => {
    if (!isAuthenticated) return
    castVoteMutation.mutate({ issueId, voteType })
  }

  const buttonSize = size === 'lg' ? 'px-4 py-2' : 'px-3 py-1'
  const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  const textSize = size === 'lg' ? 'text-sm' : 'text-xs'

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('Upvote')}
          disabled={!isAuthenticated || castVoteMutation.isPending}
          className={`${buttonSize} ${textSize} rounded-lg transition-colors flex items-center space-x-1 ${
            userVote === 'Upvote'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-secondary-50 hover:bg-green-50 text-secondary-600 hover:text-green-600 border border-secondary-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span>{votes.upvotes}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleVote('Downvote')}
          disabled={!isAuthenticated || castVoteMutation.isPending}
          className={`${buttonSize} ${textSize} rounded-lg transition-colors flex items-center space-x-1 ${
            userVote === 'Downvote'
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-secondary-50 hover:bg-red-50 text-secondary-600 hover:text-red-600 border border-secondary-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>{votes.downvotes}</span>
        </motion.button>
      </div>

      {size === 'lg' && (
        <div className="text-sm text-secondary-500">
          {votes.total_votes} total votes
        </div>
      )}

      {!isAuthenticated && (
        <span className="text-xs text-secondary-400">Login to vote</span>
      )}
    </div>
  )
}

export default VoteButton