'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import { supabase } from '@/lib/supabaseClient'

export default function PhotoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedPhotos, setRelatedPhotos] = useState([])
  const [imageError, setImageError] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageRef = useRef(null)

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) {
          throw error
        }
        
        if (data) {
          console.log('Loaded photo:', data); // Debug info
          setPhoto(data)
          
          // Fetch related photos based on tags/keywords
          await fetchRelatedPhotos(data);
        }
      } catch (error) {
        console.error('Error fetching photo:', error)
        setError('Failed to load photo. It may have been deleted or does not exist.')
      } finally {
        setLoading(false)
      }
    }
    
    // Function to fetch related photos with similar tags/attributes
    const fetchRelatedPhotos = async (currentPhoto) => {
      try {
        if (!currentPhoto) return;
        
        // Extract potential keywords from the photo's name and story
        const photoText = `${currentPhoto.image_name} ${currentPhoto.image_story}`.toLowerCase();
        const keywords = photoText.split(/\s+/)
          .filter(word => word.length > 3) // Filter out short words
          .filter(word => !['this', 'that', 'with', 'from', 'have', 'been', 'were', 'they', 'their'].includes(word));
        
        // Build a query for photos with similar attributes
        let query = supabase
          .from('image_details')
          .select('*')
          .neq('id', id); // Exclude current photo
        
        // First priority: match the image_type
        if (currentPhoto.image_type) {
          query = query.eq('image_type', currentPhoto.image_type);
        }
        
        // Get all photos that match primary criteria
        let { data: matchingPhotos, error } = await query.limit(20);
        
        if (error) {
          console.error('Error fetching similar photos:', error);
          return;
        }
        
        // Score and rank the matching photos based on content similarity
        if (matchingPhotos && matchingPhotos.length > 0) {
          const scoredPhotos = matchingPhotos.map(photo => {
            const photoContent = `${photo.image_name} ${photo.image_story || ''}`.toLowerCase();
            
            // Calculate relevance score based on matching keywords
            let relevanceScore = 0;
            keywords.forEach(keyword => {
              if (photoContent.includes(keyword)) {
                relevanceScore += 1;
              }
            });
            
            // Boost score for photos with matching location
            if (currentPhoto.location && photo.location === currentPhoto.location) {
              relevanceScore += 3;
            }
            
            return {
              ...photo,
              relevanceScore
            };
          });
          
          // Sort by relevance score (descending) and take top results
          const sortedPhotos = scoredPhotos
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 3);
          
          console.log('Loaded related photos:', sortedPhotos.length); // Debug info
          setRelatedPhotos(sortedPhotos);
        }
      } catch (error) {
        console.error('Error processing related photos:', error);
      }
    };
    
    if (id) {
      fetchPhoto()
    }
  }, [id])

  // For demo purposes, create a placeholder photo
  const placeholderPhoto = {
    id: id,
    image_name: 'Mountain Sunset',
    image_story: 'A breathtaking sunset over the mountain ranges. The warm glow of the setting sun paints the sky in vibrant hues of orange, pink, and purple, casting a magical light over the rugged mountain peaks. The silhouettes of the mountains stand in stark contrast against the colorful sky, creating a scene of both serenity and grandeur. This photograph captures the fleeting moment when day transitions to night, a reminder of nature\'s ephemeral beauty and the constant cycle of change.',
    image_url: 'https://source.unsplash.com/random/1200x800/?mountain',
    image_thumbnail_url: 'https://source.unsplash.com/random/600x400/?mountain',
    image_type: 'landscape',
    created_at: '2025-04-25T00:00:00Z',
    location: 'Rocky Mountains, Colorado',
    camera: 'Canon EOS R5',
    lens: 'Canon RF 24-70mm f/2.8L IS USM',
    settings: 'f/11, 1/60s, ISO 100',
  }

  const placeholderRelatedPhotos = [
    {
      id: 101,
      image_name: 'Alpine Lake Reflection',
      image_story: 'Crystal clear alpine lake with perfect mountain reflections.',
      image_url: 'https://source.unsplash.com/random/800x600/?lake',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?lake',
      image_type: 'landscape',
      created_at: '2025-04-23T00:00:00Z'
    },
    {
      id: 102,
      image_name: 'Misty Valley',
      image_story: 'Morning mist filling a valley at sunrise.',
      image_url: 'https://source.unsplash.com/random/800x600/?valley',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?valley',
      image_type: 'landscape',
      created_at: '2025-04-21T00:00:00Z'
    },
    {
      id: 103,
      image_name: 'Desert Dunes',
      image_story: 'Golden sand dunes at sunset with dramatic shadows.',
      image_url: 'https://source.unsplash.com/random/800x600/?dunes',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?dunes',
      image_type: 'landscape',
      created_at: '2025-04-19T00:00:00Z'
    }
  ]

  const displayPhoto = photo || placeholderPhoto
  // Only show related photos if we have actual related photos from the database, not placeholders
  const hasRelatedPhotos = relatedPhotos.length > 0
  const displayRelatedPhotos = hasRelatedPhotos ? relatedPhotos : placeholderRelatedPhotos

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader />
        </div>
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Single card containing image and details */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
            {/* Image section - dynamic sizing based on image dimensions */}
            <div className="w-full relative bg-white flex justify-center">
              {displayPhoto.image_url && !imageError ? (
                <div 
                  className={`p-8 ${
                    imageDimensions.width > imageDimensions.height * 1.2 
                      ? 'w-full' 
                      : imageDimensions.height > imageDimensions.width * 1.2 
                        ? 'max-w-xl mx-auto' 
                        : 'max-w-3xl mx-auto'
                  } transition-all duration-300 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                >
                  <img
                    ref={imageRef}
                    src={displayPhoto.image_url}
                    alt={displayPhoto.image_name}
                    className={`max-w-full ${
                      // Adjust height constraints based on aspect ratio
                      imageDimensions.width > imageDimensions.height * 1.5 
                        ? 'max-h-[70vh]' // Very wide landscape
                        : imageDimensions.height > imageDimensions.width * 1.5 
                          ? 'max-h-[85vh]' // Very tall portrait
                          : 'max-h-[65vh]' // Balanced aspect
                    } object-contain shadow-sm rounded`}
                    onLoad={(e) => {
                      const img = e.target;
                      setImageDimensions({
                        width: img.naturalWidth,
                        height: img.naturalHeight
                      });
                      setImageLoaded(true);
                      console.log(`Image loaded with dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
                    }}
                    onError={() => {
                      setImageError(true);
                      console.error(`Failed to load main image for photo ID: ${displayPhoto.id}`);
                    }}
                  />
                  
                  {/* Dimensions display for large screens */}
                  {imageLoaded && imageDimensions.width > 0 && (
                    <div className="mt-2 text-xs text-gray-500 text-center hidden sm:block">
                      {imageDimensions.width} × {imageDimensions.height} px
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full min-h-[40vh] md:min-h-[50vh] bg-gray-100 flex flex-col items-center justify-center p-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-base text-gray-500 mt-4">
                    {displayPhoto.image_url ? "Image failed to load" : "No image available"}
                  </p>
                </div>
              )}
            </div>
            
            {/* Content section */}
            <div className="p-6 md:p-8 border-t border-gray-100">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{displayPhoto.image_name}</h1>
              
              <div className="flex flex-wrap text-sm md:text-base text-gray-600 mb-8 border-b border-gray-100 pb-6">
                <span className="mr-8 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(displayPhoto.created_at)}
                </span>
                
                <span className="mr-8 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {displayPhoto.image_type.charAt(0).toUpperCase() + displayPhoto.image_type.slice(1)}
                </span>
                
                {displayPhoto.location && (
                  <span className="mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {displayPhoto.location}
                  </span>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none mb-10">
                <p className="text-gray-700 leading-relaxed">
                  {displayPhoto.image_story}
                </p>
              </div>
              
              {(displayPhoto.camera || displayPhoto.lens || displayPhoto.settings) && (
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Technical Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayPhoto.camera && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Camera</span>
                          <span className="text-gray-600">{displayPhoto.camera}</span>
                        </div>
                      </div>
                    )}
                    
                    {displayPhoto.lens && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Lens</span>
                          <span className="text-gray-600">{displayPhoto.lens}</span>
                        </div>
                      </div>
                    )}
                    
                    {displayPhoto.settings && (
                      <div className="flex items-start">
                        <div className="bg-white p-2 rounded-md shadow-sm mr-3">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium block text-gray-900 text-sm">Settings</span>
                          <span className="text-gray-600">{displayPhoto.settings}</span>
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
                {displayRelatedPhotos.map((relatedPhoto) => (
                  <Link key={relatedPhoto.id} href={`/photo/${relatedPhoto.id}`} className="block">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative overflow-hidden" style={{ minHeight: '200px' }}>
                        {(relatedPhoto.image_thumbnail_url || relatedPhoto.image_url) ? (
                          <img
                            src={relatedPhoto.image_thumbnail_url || relatedPhoto.image_url}
                            alt={relatedPhoto.image_name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            style={{ aspectRatio: 'auto' }}
                            onLoad={(e) => {
                              // Dynamically adjust container height based on aspect ratio
                              const img = e.target;
                              const aspectRatio = img.naturalWidth / img.naturalHeight;
                              
                              // For landscape images, limit height
                              if (aspectRatio > 1.3) {
                                e.target.parentElement.style.height = '220px';
                              } 
                              // For portrait images, give more height
                              else if (aspectRatio < 0.8) {
                                e.target.parentElement.style.height = '300px';
                              }
                              // For square-ish images
                              else {
                                e.target.parentElement.style.height = '250px';
                              }
                            }}
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
                        
                        <div className="mt-auto">
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