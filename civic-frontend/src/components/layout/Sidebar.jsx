import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, PlusCircle, FolderOpen, Bell, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  // Helper function to trim email for display
  const getTrimmedEmail = (email) => {
    if (!email) return 'Guest'
    const [username, domain] = email.split('@')
    if (username.length <= 10) return username
    return username.substring(0, 10) + '...'
  }

  const isActive = (path) => {
    // Exact match for most routes
    if (path === location.pathname) return true
    
    // For /issues, only match if it's exactly /issues (not /issues/create or /issues/:id)
    if (path === '/issues') {
      return location.pathname === '/issues'
    }
    
    // For /issues/create, exact match only
    if (path === '/issues/create') {
      return location.pathname === '/issues/create'
    }
    
    // For other routes, check if pathname starts with the path followed by /
    return location.pathname.startsWith(path + '/')
  }

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/issues', icon: FileText, label: 'Ongoing Issues' },
    { path: '/issues/create', icon: PlusCircle, label: 'Report Issue' },
    { path: '/my-reports', icon: FolderOpen, label: 'My Issues' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <aside className="sidebar fade-in">
      <div className="mb-6 pb-6 border-b border-secondary-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
            C
          </div>
          <div>
            <div className="font-semibold text-secondary-900 dark:text-white">CivicApp</div>
            <div className="text-xs text-secondary-600 dark:text-gray-400 truncate max-w-[160px]">
              {getTrimmedEmail(user?.email)}
            </div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`menu-link transition-all duration-200 ${
              isActive(path)
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'hover:bg-secondary-100 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
