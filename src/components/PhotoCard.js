'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function PhotoCard({ photo, featured = false }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  // Add blur hash state for progressive loading
  const [blurDataURL, setBlurDataURL] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeAJc0IL8FwAAAABJRU5ErkJggg=='); // Default tiny transparent placeholder
  // Track if component is in viewport
  const [isInViewport, setIsInViewport] = useState(false);

  // Generate color-based placeholder from image name
  useEffect(() => {
    if (photo?.image_name) {
      // Generate a simple hash from the photo name to create a consistent color
      const hash = photo.image_name.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      // Create a pastel color based on the hash
      const h = hash % 360;
      const s = 25 + (hash % 30); // Between 25-55% saturation
      const l = 80 + (hash % 15); // Between 80-95% lightness
      
      setBlurDataURL(`data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='hsl(${h},${s}%25,${l}%25)'/%3E%3C/svg%3E`);
    }
  }, [photo?.image_name]);

  // Set up intersection observer for better lazy loading
  useEffect(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const element = document.getElementById(`photo-card-${photo.id}`);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInViewport(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '200px', // Start loading when within 200px of viewport
          threshold: 0.01,
        }
      );

      observer.observe(element);
      return () => observer.disconnect();
    } else {
      // Fallback for browsers without IntersectionObserver
      setIsInViewport(true);
    }
  }, [photo.id]);

  return (
    <Link 
      href={`/photo/${photo.id}`}
      id={`photo-card-${photo.id}`}
      className={`block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer will-change-transform ${
        featured ? 'shadow-lg' : ''
      }`}
    >
      <div className="relative h-48 sm:h-64 bg-white">
        <div className="h-full w-full overflow-hidden rounded-lg">
          {/* Loading skeleton while image is loading */}
          {imageLoading && (
            <div 
              className="absolute inset-0 z-10 flex items-center justify-center"
              style={{ 
                backgroundImage: `url(${blurDataURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="w-12 h-12 rounded-full border-4 border-white border-t-gray-300 animate-spin opacity-80"></div>
            </div>
          )}
          
          {/* Only render the image if it's in/near the viewport or already loaded */}
          {((photo.image_thumbnail_url || photo.image_url) && !imageError && (isInViewport || !imageLoading)) ? (
            <Image
              src={photo.image_thumbnail_url || photo.image_url}
              alt={photo.image_name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              fetchPriority={featured ? "high" : "auto"}
              placeholder="blur"
              blurDataURL={blurDataURL}
              className={`object-cover rounded-md transition-all duration-500 will-change-transform ${
                imageLoading ? 'scale-105 opacity-0 blur-md' : 'scale-100 opacity-100 blur-0'
              }`}
              unoptimized={(photo.image_thumbnail_url || photo.image_url)?.startsWith('http')}
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                console.error("Image load error:", e);
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : imageError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-400 text-sm sm:text-base">No image available</span>
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{photo.image_name}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2">{photo.image_story}</p>
        
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-gray-500">
            {new Date(photo.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}