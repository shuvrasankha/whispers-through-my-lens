import { supabase } from '@/lib/supabaseClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PhotoCard from '@/components/PhotoCard'
import Link from 'next/link'

export const revalidate = 600; // Cache for 10 minutes

export default async function Gallery({ searchParams }) {
  const filter = searchParams.category || 'all';
  const currentPage = parseInt(searchParams.page) || 1;
  const photosPerPage = 9;

  // 1. Fetch Categories for the filter bar
  const { data: catData } = await supabase.from('image_details').select('image_type');
  const uniqueCategories = [...new Set(catData?.map(i => i.image_type))].filter(Boolean).sort();

  // 2. Fetch Photos based on searchParams
  let query = supabase.from('image_details').select('*', { count: 'exact' });
  
  if (filter !== 'all') query = query.eq('image_type', filter);
  
  const from = (currentPage - 1) * photosPerPage;
  const to = from + photosPerPage - 1;
  
  const { data: photos, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / photosPerPage);

  return (
    <>
      <Navbar />
      <main className="py-18 px-4 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Photo Gallery</h1>
          
          {/* Category Filter - Using Links instead of Buttons for speed */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <Link 
              href="/gallery?category=all"
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
            >
              All
            </Link>
            {uniqueCategories.map(cat => (
              <Link 
                key={cat}
                href={`/gallery?category=${cat}`}
                className={`px-4 py-2 rounded-md capitalize ${filter === cat ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos?.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Link
                  key={i + 1}
                  href={`/gallery?category=${filter}&page=${i + 1}`}
                  className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}