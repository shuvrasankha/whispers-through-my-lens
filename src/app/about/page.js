import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 px-4 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Hero section with profile */}
          <div className="mb-24">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">About Me</h1>
              <div className="w-24 h-1 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl">
                Capturing moments, preserving memories, and telling stories through my lens
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
              <div className="lg:w-1/3 order-2 lg:order-1">
                <div className="prose prose-lg">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Shuvrasankha Paul</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    My journey into photography began with a very basic smartphone I received after finishing high school. One afternoon, I captured a sunset — a simple, fleeting moment — but something about it stayed with me. That image sparked a quiet passion that never faded.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    After getting my first job, I finally bought my first real camera: an entry-level Sony mirrorless. It wasn't the most expensive or the most advanced, but it opened a whole new world for me. Even today, I still use that same camera — not out of necessity, but out of a deep connection to the journey it started.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-8">
                    Photography, for me, has never been about chasing the best gear. It's about capturing the feeling behind every moment, with whatever tool I have in hand.
                  </p>
                  <div className="flex space-x-5 mb-6">
                    <a href="https://www.instagram.com/shuvrasankha" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 30 30">
                        <path d="M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953 L 3 20.001953 C 3 23.860953 6.1419531 27 10.001953 27 L 20.001953 27 C 23.860953 27 27 23.858047 27 19.998047 L 27 9.9980469 C 27 6.1390469 23.858047 3 19.998047 3 L 9.9980469 3 z M 22 7 C 22.552 7 23 7.448 23 8 C 23 8.552 22.552 9 22 9 C 21.448 9 21 8.552 21 8 C 21 7.448 21.448 7 22 7 z M 15 9 C 18.309 9 21 11.691 21 15 C 21 18.309 18.309 21 15 21 C 11.691 21 9 18.309 9 15 C 9 11.691 11.691 9 15 9 z M 15 11 A 4 4 0 0 0 11 15 A 4 4 0 0 0 15 19 A 4 4 0 0 0 19 15 A 4 4 0 0 0 15 11 z"></path>
                      </svg>
                    </a>
                    <a href="https://www.facebook.com/shuvrasankha/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="Facebook">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                      </svg>
                    </a>
                    <a href="https://x.com/shuvrasankha" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors" aria-label="X (Twitter)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>
                  
                  {/* Get In Touch link removed */}
                </div>
              </div>
              
              <div className="lg:w-1/2 order-1 lg:order-2 relative mb-12 lg:mb-0">
                <div className="w-full max-w-md mx-auto aspect-[4/3] relative">
                  <div className="absolute inset-0 border-2 border-gray-200 rounded-xl transform translate-x-4 translate-y-4 z-0"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-600/20 to-transparent rounded-xl z-10"></div>
                  <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl z-20">
                    <Image
                      src="/images/me.jpg"
                      alt="Shuvrasankha Paul - Photographer"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* My approach section */}
          <div className="mb-24 bg-gray-50 rounded-2xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              My Approach
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Photography, for me, is not just about freezing a moment — it's about breathing life into it.
                  Each image I capture is a quiet attempt to preserve emotions that might otherwise drift away unnoticed. 
                  Through my lens, I strive to tell stories that are both deeply personal and universally understood, 
                  blending the beauty of fleeting moments with the timelessness of memory.
                </p>
              </div>
              
              <div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Technically, I balance traditional photography methods with the possibilities of modern digital tools. 
                  I primarily work with Sony and Fujifilm systems, carefully adapting my approach to the unique demands 
                  of each scene. Every frame is crafted with patience, intention, and a quiet respect for the story it holds.
                </p>
              </div>
            </div>
          </div>
          
          {/* Featured in section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Check Out My Work
            </h2>
            
            <div className="flex justify-center gap-8 flex-wrap">
              <Link 
                href="/gallery" 
                className="px-8 py-4 bg-gray-900 text-white font-medium rounded-lg shadow-md hover:bg-gray-800 transition-all flex items-center group"
              >
                <span>View Gallery</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow transition-all flex items-center group"
              >
                <span>Contact Me</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}