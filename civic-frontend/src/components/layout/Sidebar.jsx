import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="sidebar">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-black flex items-center justify-center text-white font-bold">C</div>
          <div>
            <div className="font-semibold">CivicApp</div>
            <div className="text-xs text-secondary-600">{user?.email || 'Guest'}</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        <Link to="/dashboard" className="menu-link">
          <span>🏠</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/issues" className="menu-link">
          <span>🧾</span>
          <span>Ongoing Issues</span>
        </Link>
        <Link to="/issues/create" className="menu-link">
          <span>➕</span>
          <span>Report Issue</span>
        </Link>
        <Link to="/my-reports" className="menu-link">
          <span>📁</span>
          <span>My Issues</span>
        </Link>
        <Link to="/notifications" className="menu-link">
          <span>🔔</span>
          <span>Notifications</span>
        </Link>
        <Link to="/profile" className="menu-link">
          <span>👤</span>
          <span>Profile</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
