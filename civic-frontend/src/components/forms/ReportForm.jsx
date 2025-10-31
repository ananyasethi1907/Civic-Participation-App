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
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: 'Image size must be less than 5MB' })
        return
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, image: 'Only JPEG, PNG, and WebP images are allowed' })
        return
      }
      
      setImage(file)
      setErrors({ ...errors, image: null })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
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
        imageFile: image
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

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-secondary-700 mb-2">
          Upload Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 border-dashed rounded-lg hover:border-secondary-400 transition-colors">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-secondary-600">
              <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                <span>Upload a file</span>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-secondary-500">PNG, JPG, GIF up to 5MB</p>
            {image && (
              <p className="text-sm text-green-600 font-medium">{image.name}</p>
            )}
            {errors.image && (
              <p className="text-red-600 text-sm">{errors.image}</p>
            )}
          </div>
        </div>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4"
          >
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </motion.div>
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
          <li>• Add photos if possible</li>
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