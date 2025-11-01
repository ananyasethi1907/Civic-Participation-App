import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, MapPin, Calendar, Award, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import { useUserIssues } from '../hooks/useIssues'
import Sidebar from '../components/layout/Sidebar'

const Profile = () => {
  const { user, signOut } = useAuth()
  const { data: userIssues = [] } = useUserIssues(user?.id)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({
    resolvedIssues: 0,
    totalVotes: 0,
    totalFeedback: 0,
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    ward: '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      // Fetch profile from Supabase citizens table
      const { data: profileData, error: profileError } = await supabase
        .from('citizens')
        .select('*')
        .eq('citizen_id', user.id)
        .single()

      if (profileError) throw profileError

      setProfile(profileData)
      setFormData({
        name: profileData.name || '',
        ward: profileData.ward || '',
        phone: profileData.phone || '',
      })
      
      // Fetch real user stats from Supabase
      const [votesCount, commentsCount] = await Promise.all([
        // Count votes cast by this user
        supabase
          .from('votes')
          .select('vote_id', { count: 'exact', head: true })
          .eq('citizen_id', user.id),
        
        // Count feedbacks/comments made by this user
        supabase
          .from('feedbacks')
          .select('feedback_id', { count: 'exact', head: true })
          .eq('citizen_id', user.id)
      ])

      // Count resolved issues from userIssues
      const resolvedCount = userIssues.filter(
        issue => issue.status.toLowerCase() === 'resolved'
      ).length

      setStats({
        resolvedIssues: resolvedCount,
        totalVotes: votesCount.count || 0,
        totalFeedback: commentsCount.count || 0,
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Update profile via API
      setProfile({ ...profile, ...formData })
      setEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
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

  return (
    <div className="app-grid fade-in">
      <Sidebar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">
          My Profile
        </h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-3xl font-bold">
                    {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-900">
                      {formData.name || 'User'}
                    </h2>
                    <p className="text-secondary-600">{user?.email}</p>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Ward Number
                    </label>
                    <input
                      type="text"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="input-field"
                      placeholder="Enter your ward"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setFormData({
                          name: profile.name || '',
                          ward: profile.ward || '',
                          phone: profile.phone || '',
                        })
                      }}
                      className="px-6 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-secondary-700">
                    <Mail size={20} />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-700">
                    <MapPin size={20} />
                    <span>Ward {formData.ward || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-secondary-700">
                    <Calendar size={20} />
                    <span>Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <Award className="mr-2" size={20} />
                Activity Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Issues Reported</span>
                  <span className="font-bold text-secondary-900">{userIssues.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Resolved</span>
                  <span className="font-bold text-green-600">{stats.resolvedIssues}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Total Votes Cast</span>
                  <span className="font-bold text-secondary-900">{stats.totalVotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Comments</span>
                  <span className="font-bold text-secondary-900">{stats.totalFeedback}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
