import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCreateIssue } from '../../hooks/useIssues'
import toast from 'react-hot-toast'

const ReportForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  })
  const [errors, setErrors] = useState({})
  
  const navigate = useNavigate()
  const createIssueMutation = useCreateIssue()

  const categories = [
    'Infrastructure',
    'Safety',
    'Sanitation',
    'Transportation',
    'Environment',
    'Utilities',
    'Other'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    try {
      const result = await createIssueMutation.mutateAsync({
        issueData: formData,
        imageFile: null  // No image
      })
      
      navigate(`/issues/${result.issue_id}`)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
          Issue Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-300 focus:ring-red-500' : ''}`}
          placeholder="Brief description of the issue"
          required
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input-field ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}`}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            placeholder="Where is this issue located?"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className={`input-field resize-none ${errors.description ? 'border-red-300 focus:ring-red-500' : ''}`}
          placeholder="Provide detailed information about the issue..."
          required
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="bg-secondary-50 p-4 rounded-lg">
        <h4 className="font-medium text-secondary-900 mb-2">
          Tips for effective reporting:
        </h4>
        <ul className="text-sm text-secondary-600 space-y-1">
          <li>• Be specific about the location</li>
          <li>• Describe the impact on the community</li>
          <li>• Include any safety concerns</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => navigate('/issues')}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={createIssueMutation.isPending}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createIssueMutation.isPending ? 'Submitting...' : 'Submit Issue'}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default ReportForm