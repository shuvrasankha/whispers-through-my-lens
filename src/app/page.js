"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/components/Loader";

// Sample featured photos data to use as fallback
const fallbackPhotos = [
  {
    id: "1",
    image_url: "/images/hero.jpg", // Using the available local image
    image_name: "Sunset Silhouettes",
    image_story: "Children playing by the waterfront at sunset, creating beautiful silhouettes against the vibrant evening sky.",
    image_type: "Landscape"
  },
  {
    id: "2",
    image_url: "/images/hero.jpg", // Using the same image as placeholder
    image_name: "Golden Hour",
    image_story: "The magical moment when daylight softens, creating a warm golden glow that transforms ordinary scenes into extraordinary memories.",
    image_type: "Nature"
  },
  {
    id: "3",
    image_url: "/images/hero.jpg", // Using the same image as placeholder
    image_name: "Evening Tranquility",
    image_story: "A peaceful moment captured as the day comes to an end, showcasing the harmony between nature and human existence.",
    image_type: "Sunset"
  }
];

export default function Home() {
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedPhotos() {
      try {
        setLoading(true);
        
        // Query the image_details table for photos with feature_flag = true
        const { data, error } = await supabase
          .from('image_details')
          .select('*')
          .eq('feature_flag', true)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // If data is available, use it; otherwise use fallback photos
        setFeaturedPhotos(data?.length > 0 ? data : fallbackPhotos);

      } catch (err) {
        console.error('Error fetching featured photos:', err);
        setError(err.message);
        setFeaturedPhotos(fallbackPhotos); // Use fallback photos if there's an error
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedPhotos();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section with improved styling */}
        <section className="pt-20 pb-24 px-4 relative">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Capturing Moments<br />
                <span className="text-gray-700">Preserving Memories</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                Welcome to my photography portfolio. Through my lens, I aim to capture 
                the essence of our world - from breathtaking landscapes to compelling portraits.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/gallery" className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors text-lg">
                  Explore Gallery
                </Link>
                <Link href="/contact" className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-lg">
                  Contact Me
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-100 rounded-full opacity-50 z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-200 rounded-full opacity-50 z-0"></div>
              <Image
                src="/images/hero.jpg"
                alt="Photography showcase"
                width={800}
                height={600}
                priority
                className="rounded-lg shadow-xl z-10 relative hover:transform hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>
        </section>
        
        {/* Featured Work Section with improved styling */}
        <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-full mb-3">Portfolio</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Featured Photography</h2>
              <div className="w-24 h-1 bg-gray-800 mx-auto mt-4"></div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-8">
                <p>Failed to load featured photos. Please try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {featuredPhotos.map((photo) => (
                  <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
                    <Link href={`/photo/${photo.id}`} className="block">
                      <div className="relative overflow-hidden h-64">
                        {photo.image_url ? (
                          <Image
                            src={photo.image_url}
                            alt={photo.image_name}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            unoptimized={photo.image_url.startsWith('http')}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image available</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{photo.image_name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{photo.image_story}</p>
                        <span className="inline-block px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium">
                          {typeof photo.image_type === 'string' 
                            ? photo.image_type.charAt(0).toUpperCase() + photo.image_type.slice(1) 
                            : 'Unknown'}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-center mt-16">
              <Link href="/gallery" className="inline-block px-8 py-4 bg-gray-900 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-colors text-lg">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
