'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhotoForm from '@/components/PhotoForm'
import PhotoEditForm from '@/components/PhotoEditForm'
import Loader from '@/components/Loader'
import AuthGuard from '@/components/AuthGuard'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [error, setError] = useState(null)
  const [messageError, setMessageError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [activeDashboardTab, setActiveDashboardTab] = useState('photos')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [imageErrors, setImageErrors] = useState({});
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const photosPerPage = 6;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setPhotos(data || [])
      } catch (error) {
        console.error('Error fetching photos:', error)
        setError('Failed to load photos. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true)
        const { data, error } = await supabase
          .from('user_messages')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
        setMessageError('Failed to load messages. Please try again.')
      } finally {
        setLoadingMessages(false)
      }
    }
    
    fetchPhotos()
    fetchMessages()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return
    }
    
    try {
      // Get the photo details first to get the image URLs
      const { data: photoData, error: fetchError } = await supabase
        .from('image_details')
        .select('*')
        .eq('id', photoId)
        .single()
        
      if (fetchError) {
        throw fetchError
      }
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('image_details')
        .delete()
        .eq('id', photoId)
      
      if (deleteError) {
        throw deleteError
      }
      
      // Try to delete the main image and thumbnail from storage
      if (photoData.image_url) {
        const mainPath = photoData.image_url.split('/').pop()
        if (mainPath) {
          await supabase.storage
            .from('images')
            .remove([`photos/${mainPath}`])
        }
      }
      
      if (photoData.image_thumbnail_url) {
        const thumbPath = photoData.image_thumbnail_url.split('/').pop()
        if (thumbPath) {
          await supabase.storage
            .from('images')
            .remove([`thumbnails/${thumbPath}`])
        }
      }
      
      // Update the photos state to remove the deleted photo
      setPhotos(photos.filter(photo => photo.id !== photoId))
      setSelectedPhoto(null)
    } catch (error) {
      console.error('Error deleting photo:', error)
      alert('Failed to delete photo. Please try again.')
    }
  }

  const handleImageError = (photoId) => {
    setImageErrors(prev => ({
      ...prev,
      [photoId]: true
    }));
    console.error(`Failed to load image for photo ID: ${photoId}`);
  }

  // Get all unique types
  const types = ['all', ...new Set(photos.map(photo => photo.image_type))]
  
  // Filter photos based on active tab and search term
  const filteredPhotos = photos.filter(photo => {
    const matchesType = activeTab === 'all' || photo.image_type === activeTab
    const matchesSearch = photo.image_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (photo.image_story && photo.image_story.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  // Pagination logic
  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = filteredPhotos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);

  // Stats for dashboard
  const stats = [
    { label: 'Total Photos', value: photos.length },
    { label: 'Categories', value: new Set(photos.map(photo => photo.image_type)).size },
    { label: 'Latest Upload', value: photos.length > 0 ? new Date(photos[0].created_at).toLocaleDateString() : 'N/A' }
  ]

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="flex-grow py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-700 mt-1">Manage your photography portfolio</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors flex items-center gap-2 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {showForm ? 'Hide Form' : 'Add New Photo'}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1 text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Navigation */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-8">
              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setActiveDashboardTab('photos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDashboardTab === 'photos' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Photos
                  </span>
                </button>
                <button
                  onClick={() => setActiveDashboardTab('messages')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDashboardTab === 'messages' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Messages
                    {messages.length > 0 && (
                      <span className="ml-2 bg-indigo-800 text-white px-2 py-0.5 text-xs rounded-full">
                        {messages.length}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Add Photo Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fadeIn">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Add New Photo</h2>
                <PhotoForm 
                  onSuccess={() => {
                    setShowForm(false)
                    // Refresh photos
                    const fetchPhotos = async () => {
                      const { data } = await supabase
                        .from('image_details')
                        .select('*')
                        .order('created_at', { ascending: false })
                      setPhotos(data || [])
                    }
                    fetchPhotos()
                  }}
                />
              </div>
            )}
            
            {/* Photo Management Section */}
            {activeDashboardTab === 'photos' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Rest of the photo management code */}
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Photos</h2>
                  <p className="text-gray-700 mt-1">Browse, filter, and manage your photo collection</p>
                </div>
                
                {/* Filters and Search */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => setActiveTab(type)}
                          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${
                            activeTab === type 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search photos..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 bg-white text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="m-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-300 flex items-center gap-3 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
                
                {/* Loading State */}
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {/* Photo Grid/Table View */}
                    <div className="p-6">
                      {filteredPhotos.length === 0 ? (
                        <div className="text-center py-12 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-medium">No photos found</p>
                          <p className="mt-1">Try a different filter or add a new photo</p>
                        </div>
                      ) : (
                        // ... Rest of photo grid code
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {currentPhotos.map((photo) => (
                            <div 
                              key={photo.id} 
                              className={`bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                                selectedPhoto?.id === photo.id ? 'ring-2 ring-indigo-600' : ''
                              }`}
                              onClick={() => setSelectedPhoto(selectedPhoto?.id === photo.id ? null : photo)}
                            >
                              <div className="aspect-w-16 aspect-h-9 w-full relative bg-gray-100">
                                {(photo.image_thumbnail_url || photo.image_url) && !imageErrors[photo.id] ? (
                                  <img 
                                    src={photo.image_thumbnail_url || photo.image_url} 
                                    alt={photo.image_name}
                                    className="w-full h-48 object-cover"
                                    onError={() => handleImageError(photo.id)}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center flex-col">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs text-gray-600 mt-2 font-medium">{photo.image_thumbnail_url ? 'Image failed to load' : 'No image'}</p>
                                  </div>
                                )}
                                <div className="absolute top-2 right-2">
                                  <span className="inline-block px-2 py-1 text-xs font-medium bg-black text-white rounded uppercase">
                                    {photo.image_type}
                                  </span>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium text-gray-900 truncate">{photo.image_name}</h3>
                                <p className="text-sm text-gray-700 mt-1 line-clamp-2">{photo.image_story}</p>
                                <div className="flex items-center justify-between mt-3">
                                  <span className="text-xs text-gray-600 font-medium">{new Date(photo.created_at).toLocaleDateString()}</span>
                                  <div className="flex space-x-2">
                                    <Link
                                      href={`/photo/${photo.id}`}
                                      className="inline-flex items-center justify-center p-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </Link>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingPhoto(photo);
                                        setSelectedPhoto(null);
                                      }}
                                      className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeletePhoto(photo.id)
                                      }}
                                      className="inline-flex items-center justify-center p-1.5 bg-red-50 text-red-700 rounded-full hover:bg-red-100"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-700 font-medium">{currentPage} of {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Messages Management Section */}
            {activeDashboardTab === 'messages' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <p className="text-gray-700 mt-1">View and manage contact form submissions</p>
                </div>
                
                {/* Search Messages */}
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="relative w-full md:w-64">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search messages..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 bg-white text-gray-800"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Error Message */}
                {messageError && (
                  <div className="m-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-300 flex items-center gap-3 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {messageError}
                  </div>
                )}
                
                {/* Loading State */}
                {loadingMessages ? (
                  <div className="h-64 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <>
                    {/* Messages List */}
                    <div className="p-6">
                      {messages.length === 0 ? (
                        <div className="text-center py-12 text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-medium">No messages found</p>
                          <p className="mt-1">You don't have any contact form submissions yet</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Message
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {messages
                                .filter(message => 
                                  message.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  message.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  message.user_message?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((message) => (
                                <tr key={message.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{message.user_name}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{message.user_email}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 line-clamp-2 max-w-md">{message.user_message}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {message.created_at ? new Date(message.created_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this message?')) {
                                          // Delete the message
                                          const deleteMessage = async () => {
                                            try {
                                              const { error } = await supabase
                                                .from('user_messages')
                                                .delete()
                                                .eq('id', message.id)
                                              
                                              if (error) throw error
                                              
                                              // Update the messages state
                                              setMessages(messages.filter(m => m.id !== message.id))
                                            } catch (error) {
                                              console.error('Error deleting message:', error)
                                              setMessageError('Failed to delete message. Please try again.')
                                            }
                                          }
                                          deleteMessage()
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Photo Detail Modal */}
            {selectedPhoto && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedPhoto.image_name}</h3>
                    <button 
                      onClick={() => setSelectedPhoto(null)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100 mb-4 rounded-lg overflow-hidden">
                      {selectedPhoto.image_url ? (
                        <img 
                          src={selectedPhoto.image_url} 
                          alt={selectedPhoto.image_name}
                          className="w-full object-cover h-64"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Type</p>
                        <p className="font-medium capitalize text-gray-900">{selectedPhoto.image_type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date</p>
                        <p className="font-medium text-gray-900">{new Date(selectedPhoto.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Story</p>
                      <p className="mt-1 text-gray-800">{selectedPhoto.image_story || 'No story provided.'}</p>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-6">
                      <Link
                        href={`/photo/${selectedPhoto.id}`}
                        className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDeletePhoto(selectedPhoto.id)}
                        className="px-4 py-2 bg-white border border-red-400 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        Delete Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Edit Modal */}
            {editingPhoto && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-900">Edit Photo Details</h3>
                    <button 
                      onClick={() => setEditingPhoto(null)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    {/* Preview of the photo being edited */}
                    <div className="w-full bg-gray-100 mb-4 rounded-lg overflow-hidden">
                      {editingPhoto.image_url ? (
                        <img 
                          src={editingPhoto.image_url} 
                          alt={editingPhoto.image_name}
                          className="w-full object-cover h-48"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Form */}
                    <PhotoEditForm 
                      photo={editingPhoto} 
                      onSuccess={() => {
                        // Refresh photos
                        const fetchPhotos = async () => {
                          const { data } = await supabase
                            .from('image_details')
                            .select('*')
                            .order('created_at', { ascending: false })
                          setPhotos(data || [])
                        }
                        fetchPhotos()
                        
                        // Close the edit modal
                        setEditingPhoto(null)
                      }}
                      onCancel={() => setEditingPhoto(null)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  )
}