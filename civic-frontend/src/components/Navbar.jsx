import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ui/ThemeToggle'

const Navbar = () => {
  const { user, signOut, isAuthenticated } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 shadow-sm border-b border-secondary-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold text-secondary-900 dark:text-white">
              CivicApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/issues" 
              className="nav-link"
            >
              Issues
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="nav-link"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/my-reports" 
                  className="nav-link"
                >
                  My Reports
                </Link>
                <Link 
                  to="/issues/create" 
                  className="btn-primary"
                >
                  Report Issue
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-secondary-600 dark:text-gray-300 text-sm hidden xl:block">
                    {user?.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-secondary-500 dark:text-gray-400 hover:text-secondary-700 dark:hover:text-gray-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="nav-link"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary-600 dark:text-gray-300 hover:text-secondary-900 dark:hover:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <motion.svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-secondary-200 dark:border-gray-700 py-4"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/issues" 
                  onClick={closeMobileMenu}
                  className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors px-2 py-1"
                >
                  Issues
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={closeMobileMenu}
                      className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors px-2 py-1"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/my-reports" 
                      onClick={closeMobileMenu}
                      className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors px-2 py-1"
                    >
                      My Reports
                    </Link>
                    <Link 
                      to="/issues/create" 
                      onClick={closeMobileMenu}
                      className="btn-primary w-fit"
                    >
                      Report Issue
                    </Link>
                    <div className="flex flex-col space-y-2 px-2 py-1">
                      <span className="text-secondary-600 dark:text-gray-300 text-sm">
                        {user?.email}
                      </span>
                      <button 
                        onClick={handleLogout}
                        className="text-secondary-500 dark:text-gray-400 hover:text-secondary-700 dark:hover:text-gray-200 text-sm text-left"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/login" 
                      onClick={closeMobileMenu}
                      className="text-secondary-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium px-2 py-1"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMobileMenu}
                      className="btn-primary w-fit"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
