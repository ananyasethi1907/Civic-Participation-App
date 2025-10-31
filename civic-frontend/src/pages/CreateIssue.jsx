import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReportForm from '../components/forms/ReportForm'

const CreateIssue = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Report an Issue
        </h1>
        <p className="text-secondary-600">
          Help improve your community by reporting problems that need attention
        </p>
      </div>

      <div className="card">
        <ReportForm />
      </div>
    </div>
  )
}

export default CreateIssue