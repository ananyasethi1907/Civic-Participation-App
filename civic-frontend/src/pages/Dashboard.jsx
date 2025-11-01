import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import Sidebar from '../components/layout/Sidebar'

const Dashboard = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Truncate email if too long
  const truncateEmail = (email, maxLength = 25) => {
    if (!email || email.length <= maxLength) return email
    const [name, domain] = email.split('@')
    if (name.length > maxLength - domain.length - 4) {
      return `${name.substring(0, maxLength - domain.length - 7)}...@${domain}`
    }
    return email
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch profile from Supabase citizens table
      const { data: profileData, error: profileError } = await supabase
        .from('citizens')
        .select('*')
        .eq('citizen_id', user.id)
        .single()

      if (profileError) throw profileError

      // Fetch notifications from Supabase
      const { data: notificationsData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('citizen_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setProfile(profileData)
      setNotifications(notificationsData || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto app-grid">
      <Sidebar />

      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back, {profile?.name || user?.email}!
          </h1>
          <p className="text-secondary-600">
            Here's what's happening in your community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/issues/create"
                className="flex items-center p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-secondary-900">Report New Issue</span>
              </Link>
              
              <Link
                to="/issues"
                className="flex items-center p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-secondary-900">Browse All Issues</span>
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-secondary-600">Name</span>
                <p className="font-medium text-secondary-900">{profile?.name}</p>
              </div>
              <div>
                <span className="text-sm text-secondary-600">Email</span>
                <p className="font-medium text-secondary-900 break-all" title={profile?.email}>
                  {profile?.email}
                </p>
              </div>
              <div>
                <span className="text-sm text-secondary-600">Ward</span>
                <p className="font-medium text-secondary-900">{profile?.ward}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Your Activity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Issues Reported</span>
                <span className="font-semibold text-secondary-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Votes Cast</span>
                <span className="font-semibold text-secondary-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary-600">Comments Made</span>
                <span className="font-semibold text-secondary-900">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Recent Notifications
          </h3>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h8V9H4v2z" />
                </svg>
              </div>
              <p className="text-secondary-600">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`p-4 rounded-lg border ${
                    notification.is_read 
                      ? 'bg-secondary-50 border-secondary-200' 
                      : 'bg-primary-50 border-primary-200'
                  }`}
                >
                  <p className="text-secondary-900">{notification.message}</p>
                  <p className="text-xs text-secondary-500 mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard