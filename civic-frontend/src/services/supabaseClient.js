import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to ensure citizen profile exists
async function ensureCitizenProfile() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  try {
    // Check if profile exists
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('citizens')
      .select('citizen_id')
      .eq('citizen_id', user.id)
      .maybeSingle()
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      const metadata = user.user_metadata || {}
      const { error: insertError } = await supabase.from('citizens').insert([{
        citizen_id: user.id,
        name: metadata.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        ward: metadata.ward || 'Ward 1',
        password_hash: 'supabase_auth_managed' // Dummy value since Supabase handles auth
      }])
      
      if (insertError) {
        console.error('Failed to create citizen profile:', insertError)
        throw new Error(`Failed to create user profile: ${insertError.message}`)
      }
      
      console.log('✅ Created citizen profile for user:', user.id)
    }
  } catch (error) {
    console.error('Error in ensureCitizenProfile:', error)
    throw error
  }
  
  return user
}

// Auth API
export const authAPI = {
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
    return data
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}

// Issues API
export const issuesAPI = {
  async getIssues(filters = {}) {
    let query = supabase
      .from('issues')
      .select(`
        *,
        citizens(name),
        votes(vote_type),
        feedbacks(count)
      `)
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getIssue(id) {
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        citizens(name),
        votes(vote_type, citizen_id),
        feedbacks(*, citizens(name))
      `)
      .eq('issue_id', id)
      .single()

    if (error) throw error
    return data
  },

  async createIssue(issueData) {
    // Ensure citizen profile exists first
    const user = await ensureCitizenProfile()

    const { data, error } = await supabase
      .from('issues')
      .insert([{
        ...issueData,
        created_by: user.id  // Add the user ID
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateIssueStatus(id, status) {
    const { data, error } = await supabase
      .from('issues')
      .update({ status })
      .eq('issue_id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getUserIssues(userId) {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Votes API
export const votesAPI = {
  async castVote(issueId, voteType) {
    // Ensure citizen profile exists first
    const user = await ensureCitizenProfile()

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('issue_id', issueId)
      .eq('citizen_id', user.id)
      .maybeSingle()

    if (existingVote) {
      // Update existing vote
      const { data, error } = await supabase
        .from('votes')
        .update({ vote_type: voteType })
        .eq('vote_id', existingVote.vote_id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new vote
      const { data, error } = await supabase
        .from('votes')
        .insert([{
          issue_id: issueId,
          citizen_id: user.id,
          vote_type: voteType
        }])
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  async getVoteCounts(issueId) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('issue_id', issueId)

    if (error) throw error

    const upvotes = data.filter(vote => vote.vote_type === 'Upvote').length
    const downvotes = data.filter(vote => vote.vote_type === 'Downvote').length

    return {
      upvotes,
      downvotes,
      total_votes: upvotes + downvotes
    }
  },

  async getUserVote(issueId, userId) {
    const { data, error } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('issue_id', issueId)
      .eq('citizen_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.vote_type || null
  }
}

// Feedbacks API
export const feedbacksAPI = {
  async addFeedback(issueId, message) {
    // Ensure citizen profile exists first
    const user = await ensureCitizenProfile()

    const { data, error } = await supabase
      .from('feedbacks')
      .insert([{
        issue_id: issueId,
        citizen_id: user.id,
        message
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getIssueFeedbacks(issueId) {
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        citizens(name)
      `)
      .eq('issue_id', issueId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Storage API
export const storageAPI = {
  async uploadImage(file, bucket = 'issue_images') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  },

  async deleteImage(filePath, bucket = 'issue_images') {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
  }
}

// Citizens API
export const citizensAPI = {
  async createCitizenProfile(userData) {
    const { data, error } = await supabase
      .from('citizens')
      .insert([userData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getCitizenProfile(userId) {
    const { data, error } = await supabase
      .from('citizens')
      .select('*')
      .eq('citizen_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateCitizenProfile(userId, updates) {
    const { data, error } = await supabase
      .from('citizens')
      .update(updates)
      .eq('citizen_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}