import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import Sidebar from '../components/layout/Sidebar'

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Mock data for demonstration
      setNotifications([
        {
          notification_id: 1,
          type: 'issue_update',
          message: 'Your issue "Broken Street Light" has been updated to In Progress',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          is_read: false,
        },
        {
          notification_id: 2,
          type: 'issue_resolved',
          message: 'Your issue "Potholes on Main Street" has been marked as Resolved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_read: false,
        },
        {
          notification_id: 3,
          type: 'feedback',
          message: 'You received a new comment on your issue',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          is_read: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      // Update locally
      setNotifications(notifications.map(notif => 
        notif.notification_id === notificationId 
          ? { ...notif, is_read: true } 
          : notif
      ))
      // TODO: Call API to mark as read
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })))
      // TODO: Call API to mark all as read
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      setNotifications(notifications.filter(notif => notif.notification_id !== notificationId))
      // TODO: Call API to delete notification
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.is_read
    return notif.is_read
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'issue_update':
        return '🔄'
      case 'issue_resolved':
        return '✅'
      case 'feedback':
        return '💬'
      default:
        return '🔔'
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Notifications
            </h1>
            <p className="text-secondary-600">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'You\'re all caught up!'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-primary flex items-center space-x-2"
            >
              <Check size={18} />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-secondary-100 p-1 rounded-lg w-fit">
          {['all', 'unread', 'read'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'unread' && unreadCount > 0 && (
                <span className="ml-2 bg-primary-600 text-white px-2 py-0.5 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No notifications
            </h3>
            <p className="text-secondary-600">
              {filter === 'all' 
                ? 'You don\'t have any notifications yet.'
                : `No ${filter} notifications.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.notification_id}
                className={`card p-4 transition-all hover:shadow-md ${
                  !notification.is_read 
                    ? 'bg-blue-50 border-l-4 border-primary-600' 
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-secondary-900 ${!notification.is_read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-sm text-secondary-500 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.notification_id)}
                        className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} className="text-primary-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.notification_id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
