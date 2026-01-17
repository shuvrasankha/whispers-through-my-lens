'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export default function PhotoForm({ onSuccess }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    image_name: '',
    image_story: '',
    image_type: '',
    image_file: null,
    feature_flag: false
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target
    
    if (name === 'image_file' && files && files[0]) {
      // Handle image file upload
      const file = files[0]
      
      if (!file.type.startsWith('image/')) {
        setFormError('Please upload an image file')
        return
      }
      
      setFormData(prev => ({ ...prev, image_file: file }))
      
      // Create preview URL
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      fileReader.readAsDataURL(file)
    } else if (type === 'checkbox') {
      // Handle checkbox inputs
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      // Handle other form fields
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const uploadFileToSupabase = async (file) => {
    try {
      // Create unique filename to avoid collisions
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = fileName // Upload directly to the root of the bucket
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percentComplete = Math.round((progress.loaded / progress.total) * 100)
            setUploadProgress(percentComplete)
          }
        })
      
      if (error) {
        console.error("Upload error:", error)
        throw error
      }
      
      // Get public URL for the uploaded file - using the correct method
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath)
        
      console.log("Generated public URL:", urlData.publicUrl) // Log for debugging
      
      return urlData.publicUrl
    } catch (error) {
      console.error(`Error uploading image:`, error)
      throw new Error(`Failed to upload image: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image_name || !formData.image_story || !formData.image_type) {
      setFormError('Please fill in all the fields')
      return
    }

    if (!formData.image_file) {
      setFormError('Please upload an image')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)
      
      // Step 1: Upload image to Supabase storage and get public URL
      const imageUrl = await uploadFileToSupabase(formData.image_file)
      
      // Step 2: Insert the image metadata and URL into the database
      // Removed image_thumbnail_url field as it no longer exists in the database
      const { error: insertError } = await supabase
        .from('image_details')
        .insert({
          image_name: formData.image_name,
          image_story: formData.image_story,
          image_type: formData.image_type,
          image_url: imageUrl,
          feature_flag: formData.feature_flag
        })

      if (insertError) {
        throw new Error(insertError.message)
      }

      // Reset form
      setFormData({ 
        image_name: '', 
        image_story: '', 
        image_type: '',
        image_file: null,
        feature_flag: false
      })
      setPreviewUrl(null)
      setUploadProgress(0)
      
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      // Call the success callback or redirect
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/gallery')
        router.refresh()
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload New Photo</h2>
      
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
        
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="feature_flag"
            name="feature_flag"
            checked={formData.feature_flag}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="feature_flag" className="ml-2 block text-sm text-gray-700">
            Feature this image (displayed prominently on the site)
          </label>
        </div>
        
        <div className="mb-6">
          <label htmlFor="image_file" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Photo
          </label>
          <input
            type="file"
            id="image_file"
            name="image_file"
            accept="image/*"
            required
            onChange={handleChange}
            ref={fileInputRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-900"
          />
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
            </div>
          )}
          
          {previewUrl && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img 
                src={previewUrl} 
                alt="Image preview" 
                className="h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  )
}