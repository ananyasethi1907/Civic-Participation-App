import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { issuesAPI, votesAPI, feedbacksAPI, storageAPI } from '../services/supabaseClient'
import toast from 'react-hot-toast'

// Issues hooks
export const useIssues = (filters = {}) => {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: () => issuesAPI.getIssues(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useIssue = (id) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => issuesAPI.getIssue(id),
    enabled: !!id,
  })
}

export const useUserIssues = (userId) => {
  return useQuery({
    queryKey: ['userIssues', userId],
    queryFn: () => issuesAPI.getUserIssues(userId),
    enabled: !!userId,
  })
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ issueData, imageFile }) => {
      let imageUrl = null
      
      if (imageFile) {
        imageUrl = await storageAPI.uploadImage(imageFile)
      }
      
      return issuesAPI.createIssue({
        ...issueData,
        image_url: imageUrl
      })
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['userIssues'] })
      toast.success('Issue reported successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create issue')
    }
  })
}

export const useUpdateIssueStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => issuesAPI.updateIssueStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['issue', data.issue_id] })
      toast.success('Issue status updated!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update issue status')
    }
  })
}

// Voting hooks
export const useVoteCounts = (issueId) => {
  return useQuery({
    queryKey: ['voteCounts', issueId],
    queryFn: () => votesAPI.getVoteCounts(issueId),
    enabled: !!issueId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export const useUserVote = (issueId, userId) => {
  return useQuery({
    queryKey: ['userVote', issueId, userId],
    queryFn: () => votesAPI.getUserVote(issueId, userId),
    enabled: !!(issueId && userId),
  })
}

export const useCastVote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ issueId, voteType }) => votesAPI.castVote(issueId, voteType),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['voteCounts', variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ['userVote', variables.issueId] })
      toast.success('Vote recorded!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to cast vote')
    }
  })
}

// Feedback hooks
export const useIssueFeedbacks = (issueId) => {
  return useQuery({
    queryKey: ['feedbacks', issueId],
    queryFn: () => feedbacksAPI.getIssueFeedbacks(issueId),
    enabled: !!issueId,
  })
}

export const useAddFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ issueId, message }) => feedbacksAPI.addFeedback(issueId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks', variables.issueId] })
      queryClient.invalidateQueries({ queryKey: ['issue', variables.issueId] })
      toast.success('Comment added!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add comment')
    }
  })
}