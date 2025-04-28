'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhotoCard from '@/components/PhotoCard'
import Loader from '@/components/Loader'
import { supabase } from '@/lib/supabaseClient'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [categories, setCategories] = useState([
    { value: 'all', label: 'All Categories' }
  ])

  // Fetch unique categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('image_details')
          .select('image_type')
          .not('image_type', 'is', null)
        
        if (error) {
          throw error
        }
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.image_type))]
          .filter(Boolean) // Remove any falsy values
          .sort() // Sort alphabetically
          .map(category => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1) // Capitalize first letter
          }));
        
        // Keep "All Categories" at the beginning
        setCategories([
          { value: 'all', label: 'All Categories' },
          ...uniqueCategories
        ]);
      } catch (err) {
        console.error('Error fetching categories:', err)
        // Don't set error state here as it would affect the photo gallery display
      }
    }
    
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true)
        
        let query = supabase
          .from('image_details')
          .select('*')
        
        // Apply ordering based on filter
        if (filter === 'all') {
          // For "All Categories" apply random ordering
          query = query.order('id', { ascending: false }) // Fetch all photos
        } else {
          // For specific categories, maintain chronological order
          query = query.eq('image_type', filter)
            .order('created_at', { ascending: false })
        }
        
        const { data, error } = await query
        
        if (error) {
          throw error
        }
        
        // If "All Categories" is selected, shuffle the results for random display
        if (filter === 'all' && data) {
          // Fisher-Yates shuffle algorithm
          const shuffled = [...data]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          setPhotos(shuffled)
        } else {
          setPhotos(data || [])
        }
      } catch (error) {
        setError('Failed to load photos. Please try again later.')
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPhotos()
  }, [filter])

  // For demo purposes, create placeholder photos
  const placeholderPhotos = [
    {
      id: 1,
      image_name: 'Mountain Sunset',
      image_story: 'A breathtaking sunset over the mountain ranges.',
      image_url: 'https://source.unsplash.com/random/800x600/?mountain',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?mountain',
      image_type: 'landscape',
      created_at: '2025-04-25T00:00:00Z'
    },
    {
      id: 2,
      image_name: 'Ocean Waves',
      image_story: 'The hypnotic rhythm of ocean waves crashing on the shore.',
      image_url: 'https://source.unsplash.com/random/800x600/?ocean',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?ocean',
      image_type: 'landscape',
      created_at: '2025-04-20T00:00:00Z'
    },
    {
      id: 3,
      image_name: 'Urban Portrait',
      image_story: 'A captivating portrait amidst the urban landscape.',
      image_url: 'https://source.unsplash.com/random/800x600/?portrait',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?portrait',
      image_type: 'portrait',
      created_at: '2025-04-15T00:00:00Z'
    },
    {
      id: 4,
      image_name: 'Wildlife in Motion',
      image_story: 'Capturing the grace and beauty of wildlife in their natural habitat.',
      image_url: 'https://source.unsplash.com/random/800x600/?wildlife',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?wildlife',
      image_type: 'wildlife',
      created_at: '2025-04-10T00:00:00Z'
    },
    {
      id: 5,
      image_name: 'City Lights',
      image_story: 'The magical glow of city lights at twilight.',
      image_url: 'https://source.unsplash.com/random/800x600/?city',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?city',
      image_type: 'street',
      created_at: '2025-04-05T00:00:00Z'
    },
    {
      id: 6,
      image_name: 'Abstract Patterns',
      image_story: 'Finding art in unexpected places and patterns.',
      image_url: 'https://source.unsplash.com/random/800x600/?abstract',
      image_thumbnail_url: 'https://source.unsplash.com/random/400x300/?abstract',
      image_type: 'abstract',
      created_at: '2025-04-01T00:00:00Z'
    }
  ]

  const displayPhotos = photos.length > 0 ? photos : placeholderPhotos

  return (
    <>
      <Navbar />
      <main className="py-12 px-4 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">Photo Gallery</h1>
          
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
              {displayPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && displayPhotos.length === 0 && (
            <div className="text-center text-gray-600 py-12 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-xl">No photos found in this category.</p>
              <p className="mt-2">Try selecting a different category or check back later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}