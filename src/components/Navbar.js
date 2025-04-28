'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-90 text-gray-800 py-3' 
        : 'bg-transparent text-white py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <span className={`text-2xl font-bold tracking-tight ${
                scrolled ? 'text-gray-900' : 'text-white'
              } transition-colors duration-300`}>
                Whispers Through My Lens
                <span className="block h-1 w-0 group-hover:w-full bg-gray-800 transition-all duration-300"></span>
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" 
              className={`px-3 py-2 text-md font-medium rounded-lg transition-all duration-300 ${
                pathname === '/' 
                  ? scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/20 text-white' 
                  : scrolled ? 'hover:bg-gray-50' : 'hover:bg-white/10'
              }`}>
              Home
            </Link>
            <Link href="/gallery" 
              className={`px-3 py-2 text-md font-medium rounded-lg transition-all duration-300 ${
                pathname === '/gallery' 
                  ? scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/20 text-white' 
                  : scrolled ? 'hover:bg-gray-50' : 'hover:bg-white/10'
              }`}>
              Gallery
            </Link>
            <Link href="/about" 
              className={`px-3 py-2 text-md font-medium rounded-lg transition-all duration-300 ${
                pathname === '/about' 
                  ? scrolled ? 'bg-gray-100 text-gray-900' : 'bg-white/20 text-white' 
                  : scrolled ? 'hover:bg-gray-50' : 'hover:bg-white/10'
              }`}>
              About
            </Link>
            <Link href="/contact" 
              className={`px-4 py-2 text-md font-medium rounded-full border-2 transition-all duration-300 ${
                scrolled 
                  ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-gray-800'
              }`}>
              Contact
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with improved styling */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white text-gray-800 shadow-xl rounded-b-xl mx-4 mt-2 overflow-hidden transition-all duration-300 ease-in-out`}>
        <div className="px-2 py-4 space-y-2">
          <Link href="/" 
            className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
              pathname === '/' 
                ? 'bg-gray-100 text-gray-900' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link href="/gallery" 
            className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
              pathname === '/gallery' 
                ? 'bg-gray-100 text-gray-900' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setIsMenuOpen(false)}>
            Gallery
          </Link>
          <Link href="/about" 
            className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
              pathname === '/about' 
                ? 'bg-gray-100 text-gray-900' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <div className="pt-2 pb-1">
            <Link href="/contact" 
              className="block w-full px-4 py-3 text-center text-base font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}>
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}