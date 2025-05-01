'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhotoCard from '@/components/PhotoCard'
import Loader from '@/components/Loader'
import { supabase } from '@/lib/supabaseClient'

// Category descriptions - moved out of the component for cleaner code
const categoryDescriptions = {
  all: "Every frame here holds a story — a silent whisper of light, emotion, and fleeting moments. These aren't just photographs; they're fragments of time I've paused, hoping you'll feel what I felt when I clicked the shutter.",
  landscape: "Nature's grand canvas unfolds before my lens. These landscape photographs capture the breathtaking beauty of our world, from sweeping horizons to intimate natural details.",
  portrait: "Faces tell stories words never could. In these portraits, I seek to capture not just appearances, but the essence of each subject — their spirit, their emotions, their unique human experience.",
  street: "The rhythm of rural life unfolds in these frames. My photography captures the authentic moments of village existence — the simplicity, traditions, and timeless connections that define life away from the urban rush.",
  wildlife: "The natural world in its most authentic form. These wildlife images represent moments of patience and privilege, capturing the beauty, behavior, and sometimes the vulnerability of creatures in their natural habitats.",
  abstract: "Beyond the literal lies a world of shape, form, color, and texture. My abstract photography invites you to see differently — to find beauty in the unconventional and meaning in the ambiguous.",
  architecture: "Buildings tell the stories of cultures, eras, and human ingenuity. My architectural photography explores the dialogue between space, light, and structure — revealing the soul and character behind seemingly static facades."
}

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [featuredPhotos, setFeaturedPhotos] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories' }
  ])
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPhotos, setTotalPhotos] = useState(0)
  const photosPerPage = 9 // Display 9 photos per page (3x3 grid)

  // Fetch unique categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('image_details')
          .select('image_type')
          .not('image_type', 'is', null)
        
        if (error) throw error
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.image_type))]
          .filter(Boolean)
          .sort()
          .map(category => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1)
          }));
        
        setCategories([
          { value: 'all', label: 'All Categories' },
          ...uniqueCategories
        ]);
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    
    fetchCategories()
  }, [])

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        
        // First, get count for pagination
        let countQuery = supabase
          .from('image_details')
          .select('id', { count: 'exact' })
        
        if (filter !== 'all') {
          countQuery = countQuery.eq('image_type', filter)
        }
        
        const { count, error: countError } = await countQuery
        if (countError) throw countError
        
        setTotalPhotos(count || 0)
        
        // Then fetch the current page
        let query = supabase
          .from('image_details')
          .select('*')
        
        // Apply ordering and filtering
        if (filter === 'all') {
          query = query.order('id', { ascending: false })
        } else {
          query = query.eq('image_type', filter)
            .order('created_at', { ascending: false })
        }
        
        // Apply pagination
        const from = (currentPage - 1) * photosPerPage
        const to = from + photosPerPage - 1
        query = query.range(from, to)
        
        const { data, error } = await query
        if (error) throw error
        
        setPhotos(data || [])
      } catch (error) {
        setError('Failed to load photos. Please try again later.')
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPhotos()
  }, [filter, currentPage, photosPerPage])

  // Fetch featured photos
  useEffect(() => {
    const fetchFeaturedPhotos = async () => {
      try {
        setLoadingFeatured(true)
        
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .eq('feature_flag', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        setFeaturedPhotos(data || [])
      } catch (error) {
        console.error('Error fetching featured photos:', error)
      } finally {
        setLoadingFeatured(false)
      }
    }
    
    fetchFeaturedPhotos()
  }, [])

  // Calculate pagination information
  const totalPages = Math.ceil(totalPhotos / photosPerPage)
  
  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      // Set the new page first
      setCurrentPage(page)
      
      // Use a ref to the top of the gallery content for smoother scrolling
      const galleryTop = document.getElementById('gallery-top')
      if (galleryTop) {
        galleryTop.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      } else {
        // Fallback to window scroll if element not found
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <>
      <Navbar />
      <main className="py-18 px-4 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Added ID for scroll targeting */}
          <h1 id="gallery-top" className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Photo Gallery</h1>
          
          {/* Featured Photos Section */}
          {!loadingFeatured && featuredPhotos.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
                <span className="inline-block border-b-2 border-gray-800 pb-1">Featured Photos</span>
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPhotos.map((photo) => (
                    <PhotoCard key={photo.id} photo={photo} featured={true} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Description text - category specific */}
          {categoryDescriptions[filter] && (
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <p className="text-gray-700 text-lg font-light leading-relaxed tracking-wide">
                <span className="text-2xl font-serif">"</span>
                {categoryDescriptions[filter]}
                <span className="text-2xl font-serif">"</span>
              </p>
            </div>
          )}
          
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  className={`px-4 py-2 rounded-md text-sm md:text-base transition-colors ${
                    filter === category.value
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-center mb-8 p-4 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className="h-64 flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            /* Photo Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && photos.length === 0 && (
            <div className="text-center text-gray-600 py-12 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-xl">No photos found in this category.</p>
              <p className="mt-2">Try selecting a different category or check back later.</p>
            </div>
          )}
          
          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center space-y-4">
              <div className="text-gray-600">
                Page {currentPage} of {totalPages} ({totalPhotos} photos total)
              </div>
              <div className="flex space-x-2">
                {/* First page button */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label="First page"
                >
                  &laquo;
                </button>
                
                {/* Previous page button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label="Previous page"
                >
                  &lsaquo;
                </button>
                
                {/* Page number buttons - show at most 5 pages */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === pageNum
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {/* Next page button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label="Next page"
                >
                  &rsaquo;
                </button>
                
                {/* Last page button */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-label="Last page"
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}