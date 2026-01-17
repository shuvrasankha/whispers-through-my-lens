import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

// Incremental Static Regeneration: Revalidate data every hour
export const revalidate = 3600;

export default async function Home() {
  // Fetch data on the server - fetching only required columns for speed
  const { data: featuredPhotos } = await supabase
    .from('image_details')
    .select('id, image_url, image_name, image_story, image_type')
    .eq('feature_flag', true)
    .limit(6);

  const photos = featuredPhotos || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-12 md:pt-20 pb-16 md:pb-24 px-4">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Capturing Moments<br />
                <span className="text-gray-700">Preserving Memories</span>
              </h1>
              <p className="text-lg text-gray-700">
                Through my lens, I aim to capture the essence of our world.
              </p>
              <Link href="/gallery" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg">
                Explore Gallery
              </Link>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="https://yywgadreuosyccwcjmil.supabase.co/storage/v1/object/public/static-photos//hero.jpg"
                alt="Showcase"
                width={800}
                height={600}
                priority
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>
        
        {/* Featured Work */}
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Photography</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-lg group">
                  <Link href={`/photo/${photo.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={photo.image_url}
                        alt={photo.image_name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{photo.image_name}</h3>
                      <p className="text-gray-600 line-clamp-2">{photo.image_story}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}