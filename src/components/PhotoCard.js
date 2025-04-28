'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function PhotoCard({ photo }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      href={`/photo/${photo.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative h-64 p-2 bg-white">
        <div className="h-full w-full border-4 border-white shadow-inner overflow-hidden rounded-lg">
          {photo.image_url && !imageError ? (
            <img
              src={photo.image_url}
              alt={photo.image_name}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                console.error("Image load error:", e);
                setImageError(true);
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{photo.image_name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{photo.image_story}</p>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-500">
            {new Date(photo.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}