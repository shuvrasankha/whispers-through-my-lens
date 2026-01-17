import Image from 'next/image'
import Link from 'next/link'

export default function PhotoCard({ photo }) {
  return (
    <Link 
      href={`/photo/${photo.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-64 p-2 bg-white">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
            src={photo.image_thumbnail_url || photo.image_url}
            alt={photo.image_name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-300"
            // Next.js will now optimize these Supabase URLs automatically
          />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{photo.image_name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{photo.image_story}</p>
        <div className="mt-3 text-xs text-gray-500">
          {new Date(photo.created_at).toLocaleDateString()}
        </div>
      </div>
    </Link>
  )
}