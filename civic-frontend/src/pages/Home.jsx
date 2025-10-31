import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-secondary-900 dark:text-white mb-4 sm:mb-6"
        >
          Make Your Voice Heard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-secondary-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4"
        >
          Report civic issues, vote on community problems, and track progress 
          in your neighborhood. Together, we can build better communities.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
        >
          {isAuthenticated ? (
            <>
              <Link to="/issues/create" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                Report an Issue
              </Link>
              <Link to="/issues" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                Browse Issues
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                Get Started
              </Link>
              <Link to="/issues" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3">
                View Issues
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-12 sm:py-16 px-4">
        {[
          {
            icon: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Report Issues",
            description: "Easily report potholes, broken streetlights, and other civic issues with photos and location details."
          },
          {
            icon: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5T6.5 15a2.5 2.5 0 002.5 2.5z",
            title: "Vote & Prioritize",
            description: "Vote on issues that matter to you. Help prioritize which problems need immediate attention from local authorities."
          },
          {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Track Progress",
            description: "Get real-time updates on issue status. See when problems are acknowledged, in progress, or resolved."
          }
        ].map((feature, index) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * index }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-secondary-600 dark:text-gray-300 text-sm sm:text-base">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-primary-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 text-center mx-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white mb-6 sm:mb-8">
          Community Impact
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: "1,247", label: "Issues Reported" },
            { number: "892", label: "Issues Resolved" },
            { number: "3,456", label: "Votes Cast" },
            { number: "567", label: "Active Citizens" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1 + (0.1 * index) }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1 sm:mb-2">{stat.number}</div>
              <div className="text-secondary-600 dark:text-gray-300 text-sm sm:text-base">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home