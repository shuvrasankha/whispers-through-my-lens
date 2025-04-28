'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PhotoEditForm({ photo, onSuccess, onCancel }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formData, setFormData] = useState({
    image_name: photo.image_name || '',
    image_story: photo.image_story || '',
    image_type: photo.image_type || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image_name || !formData.image_story || !formData.image_type) {
      setFormError('Please fill in all the fields')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      
      // Update the image metadata in the database
      const { error: updateError } = await supabase
        .from('image_details')
        .update({
          image_name: formData.image_name,
          image_story: formData.image_story,
          image_type: formData.image_type,
        })
        .eq('id', photo.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Call the success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const imageTypes = [
    "landscape", "portrait", "street", "abstract", 
    "wildlife", "architecture", "macro", "night", 
    "travel", "documentary"
  ]

  return (
    <div className="bg-white p-6 rounded-lg">
      {formError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image_name" className="block text-sm font-medium text-gray-700 mb-1">
            Image Name
          </label>
          <input
            type="text"
            id="image_name"
            name="image_name"
            required
            placeholder="Enter image name"
            value={formData.image_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 text-gray-900"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="image_story" className="block text-sm font-medium text-gray-700 mb-1">
            Image Story
          </label>
          <textarea
            id="image_story"
            name="image_story"
            rows="4"
            required
            placeholder="Tell the story behind this image..."
            value={formData.image_story}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 text-gray-900"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="image_type" className="block text-sm font-medium text-gray-700 mb-1">
            Image Type
          </label>
          <select
            id="image_type"
            name="image_type"
            required
            value={formData.image_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
          >
            <option value="" className="text-gray-400">Select an image type</option>
            {imageTypes.map(type => (
              <option key={type} value={type} className="text-gray-900">{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}