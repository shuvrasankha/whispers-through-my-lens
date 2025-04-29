'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function PhotoCard({ photo }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Link 
      href={`/photo/${photo.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer will-change-transform"
    >
      <div className="relative h-48 sm:h-64 p-2 bg-white">
        <div className="h-full w-full border-4 border-white shadow-inner overflow-hidden rounded-lg">
          {/* Loading skeleton while image is loading */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md z-10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-gray-500 animate-spin"></div>
            </div>
          )}
          
          {photo.image_url && !imageError ? (
            <Image
              src={photo.image_url}
              alt={photo.image_name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              loading="lazy"
              fetchPriority="auto"
              className={`object-cover rounded-md transition-opacity duration-300 will-change-transform ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              unoptimized={photo.image_url.startsWith('http')}
              onLoadingComplete={() => setImageLoading(false)}
              onError={(e) => {
                console.error("Image load error:", e);
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-400 text-sm sm:text-base">No image available</span>
            </div>
          )}
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