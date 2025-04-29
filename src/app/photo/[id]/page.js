'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

// Util function for formatting dates - moved outside component
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Component for displaying the skeleton loading state
const PhotoDetailSkeleton = () => (
  <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16 animate-pulse">
        {/* Image skeleton */}
        <div className="w-full h-[60vh] bg-gray-200 flex justify-center items-center p-8">
          <div className="w-16 h-16 rounded-full border-4 border-gray-300 border-t-gray-500 animate-spin"></div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-6 md:p-10 border-t border-gray-100">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          
          <div className="flex flex-wrap mb-8">
            <div className="h-6 bg-gray-200 rounded w-32 mr-8 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-28 mr-8 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
          </div>
          
          <div className="space-y-4 mb-12">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related photos skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm h-full animate-pulse">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-24 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function PhotoDetailPage() {
  const { id } = useParams()
  
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedPhotos, setRelatedPhotos] = useState([])
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        if (data) {
          setPhoto(data)
          // Fetch related photos
          fetchRelatedPhotos(data)
        }
      } catch (error) {
        console.error('Error fetching photo:', error)
        setError('Failed to load photo. It may have been deleted or does not exist.')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchRelatedPhotos = async (currentPhoto) => {
      if (!currentPhoto) return
      
      try {
        // Extract keywords from the photo's name and story for matching
        const photoText = `${currentPhoto.image_name} ${currentPhoto.image_story || ''}`.toLowerCase()
        const keywords = photoText.split(/\s+/)
          .filter(word => word.length > 3)
          .filter(word => !['this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their'].includes(word))
        
        // Query for photos with the same image type
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .eq('image_type', currentPhoto.image_type)
          .neq('id', id)
          .limit(10)
        
        if (error) throw error
        
        if (data && data.length > 0) {
          // Score photos based on content similarity
          const scoredPhotos = data.map(photo => {
            const photoContent = `${photo.image_name} ${photo.image_story || ''}`.toLowerCase()
            
            // Calculate relevance score
            let relevanceScore = 0
            keywords.forEach(keyword => {
              if (photoContent.includes(keyword)) {
                relevanceScore += 1
              }
            })
            
            // Boost score for photos with matching location
            if (currentPhoto.location && photo.location === currentPhoto.location) {
              relevanceScore += 3
            }
            
            return { ...photo, relevanceScore }
          })
          
          // Get the top 3 most relevant photos
          const relatedResults = scoredPhotos
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3)
          
          setRelatedPhotos(relatedResults)
        }
      } catch (error) {
        console.error('Error fetching related photos:', error)
      }
    }
    
    if (id) {
      fetchPhoto()
    }
  }, [id])

  // Only show related photos if we actually have some
  const hasRelatedPhotos = relatedPhotos.length > 0

  if (loading) {
    return (
      <>
        <Navbar />
        <PhotoDetailSkeleton />
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-20 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-red-600">Photo Not Found</h1>
            <p className="text-gray-600 mb-10 text-lg">{error}</p>
            <Link
              href="/gallery"
              className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md"
            >
              Return to Gallery
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Single card containing image and details */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
            {/* Image section */}
            <div className="w-full relative bg-white overflow-hidden">
              {photo.image_url && !imageError ? (
                <div className="flex justify-center items-center py-10 px-4 md:px-8">
                  <img
                    src={photo.image_url}
                    alt={photo.image_name}
                    className="max-w-full max-h-[80vh] object-contain shadow-md rounded"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : (
                <div className="w-full min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-base text-gray-500 mt-4">
                    {photo.image_url ? "Image failed to load" : "No image available"}
                  </p>
                </div>
              )}
            </div>
            
            {/* Content section */}
            <div className="p-6 md:p-10 border-t border-gray-100 bg-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{photo.image_name}</h1>
              
              <div className="flex flex-wrap text-sm md:text-base text-gray-600 mb-10 border-b border-gray-100 pb-6">
                <span className="mr-8 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(photo.created_at)}
                </span>
                
                <span className="mr-8 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {photo.image_type.charAt(0).toUpperCase() + photo.image_type.slice(1)}
                </span>
                
                {photo.location && (
                  <span className="mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {photo.location}
                  </span>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-gray-700 leading-relaxed">
                  {photo.image_story}
                </p>
              </div>
              
              {(photo.camera || photo.lens || photo.settings) && (
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Technical Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {photo.camera && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Camera</span>
                          <span className="text-gray-600">{photo.camera}</span>
                        </div>
                      </div>
                    )}
                    
                    {photo.lens && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Lens</span>
                          <span className="text-gray-600">{photo.lens}</span>
                        </div>
                      </div>
                    )}
                    
                    {photo.settings && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Settings</span>
                          <span className="text-gray-600">{photo.settings}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Photos Section - Only displayed when similar photos exist */}
          {hasRelatedPhotos && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <svg className="w-6 h-6 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                More Like This
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPhotos.map((relatedPhoto) => (
                  <Link key={relatedPhoto.id} href={`/photo/${relatedPhoto.id}`} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative overflow-hidden h-48">
                        {(relatedPhoto.image_thumbnail_url || relatedPhoto.image_url) ? (
                          <img
                            src={relatedPhoto.image_thumbnail_url || relatedPhoto.image_url}
                            alt={relatedPhoto.image_name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gray-200 flex items-center justify-center"><span class="text-gray-400">No image available</span></div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{relatedPhoto.image_name}</h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">{relatedPhoto.image_story}</p>
                        
                        {/* Increased top padding with pt-4 class */}
                        <div className="mt-auto pt-8">
                          <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                            View Details
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}