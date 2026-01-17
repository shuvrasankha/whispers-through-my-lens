import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Me | Shuvrasankha Paul Photography",
  description: "Learn about Shuvrasankha Paul's photography journey, philosophy, and approach to capturing memorable moments.",
};

export default function About() {
  return (
    <>
      <Navbar />
      {/* Improved background and styling */}
      <main className="pt-28 md:pt-36 pb-12 md:pb-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 pb-4 text-gray-900">About Me</h1>

          {/* Hero Section - Improved layout */}
          <section className="mb-16 md:mb-24 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image Column - Enhanced styling with animations */}
              <div className="relative w-3/5 md:w-1/2 aspect-square mx-auto lg:mx-0 order-1 lg:order-2 animate-fadeIn">
                {/* Updated background effect with rotate animation */}
                <div className="absolute -inset-4 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-lg blur-xl opacity-70 group-hover:opacity-80 transition duration-1000 animate-gradientSpin"></div>
                {/* Image container with enhanced animations */}
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-xl border-4 border-white hover:scale-110 hover:rotate-2 transition-all duration-500 transform hover:shadow-2xl">
                  <Image
                    src="https://yywgadreuosyccwcjmil.supabase.co/storage/v1/object/public/static-photos//me.jpg"
                    alt="Shuvrasankha Paul - Photographer"
                    fill
                    className="object-cover transition-all duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 1023px) 50vw, 30vw"
                    unoptimized={true}
                  />
                </div>
              </div>

              {/* Text Column - Enhanced typography and spacing */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 leading-tight">
                  Shuvrasankha Paul
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 font-medium mb-6">
                  Photographer & Storyteller
                </p>
                <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Capturing the essence of moments, preserving memories, and weaving narratives through the art of photography.
                </p>
                {/* Social Links - Improved styling */}
                <div className="flex justify-center lg:justify-start space-x-6 mb-8">
                  <a href="https://www.instagram.com/shuvrasankha" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-gray-900 transition-colors transform hover:scale-110" 
                     aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 30 30"><path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path></svg>
                  </a>
                  <a href="https://www.facebook.com/shuvrasankha/" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-gray-900 transition-colors transform hover:scale-110" 
                     aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </a>
                  <a href="https://x.com/shuvrasankha" target="_blank" rel="noopener noreferrer" 
                     className="text-gray-500 hover:text-black transition-colors transform hover:scale-110" 
                     aria-label="X (Twitter)">
                     <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Journey Section - Improved card styling */}
          <section className="mb-16 md:mb-24 py-12 md:py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">My Photographic Journey</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                <p>
                  My journey into photography began unexpectedly with a basic smartphone gifted after high school. A simple sunset capture one afternoon ignited a quiet passion that has grown ever since. That fleeting moment, preserved, stayed with me and set me on this path.
                </p>
                <p>
                  Years later, after starting my first job, I invested in my first dedicated camera: an entry-level Sony mirrorless. It wasn't top-of-the-line, but it unlocked a new dimension of creative expression. To this day, I often reach for that same camera, not just out of habit, but as a reminder of where this journey began and the connection I feel to the process.
                </p>
                <p>
                  For me, photography transcends the pursuit of the latest gear. It's about connecting with the feeling behind each moment, the story waiting to be told, and capturing that essence with whatever tool is at hand. It's about observation, patience, and finding beauty in the ordinary.
                </p>
              </div>
            </div>
          </section>

          {/* Approach Section - Enhanced card design */}
          <section className="mb-16 md:mb-24">
             <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">My Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 hover:border-gray-300 group">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center group-hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 inline-block text-gray-800 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Philosophy
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Photography, for me, is not just about freezing a moment — it's about breathing life into it. Each image is a quiet attempt to preserve emotions that might otherwise drift away. Through my lens, I strive to tell stories that are both deeply personal and universally understood, blending fleeting beauty with timeless memory.
                </p>
              </div>
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 hover:border-gray-300 group">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center group-hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 inline-block text-gray-800 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Technique
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  I balance traditional methods with modern digital tools, primarily working with Sony and Fujifilm systems. My approach adapts to the unique demands of each scene, focusing on composition, light, and emotion. Every frame is crafted with patience, intention, and respect for the story it holds within.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}