'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null })
    
    try {
      // Insert data into the user_messages table
      const { error } = await supabase
        .from('user_messages')
        .insert([
          { 
            user_name: formData.name,
            user_email: formData.email,
            user_message: formData.message
          }
        ])
      
      if (error) throw error
      
      // Success
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null })
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Error inserting message:', error)
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: 'There was an error sending your message. Please try again.'
      })
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 px-4 min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-black opacity-5 z-0 overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-black"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.03,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-800 relative">
                Get In Touch
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"></div>
              </h1>
            </div>
            
            <p className="text-gray-600 text-center mb-2 max-w-2xl mx-auto">
              I'd love to hear from you! Whether you're interested in my photography, have a question about my work, or just want to say hello.
            </p>
          </div>
          
          {/* Contact Form Panel */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 md:p-10 relative">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-50 rounded-full -mb-12 -ml-12"></div>
            
            {formStatus.isSubmitted ? (
              <div className="text-center py-16 relative z-10">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Your message has been sent successfully. I'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setFormStatus({ isSubmitting: false, isSubmitted: false, error: null })}
                  className="px-8 py-3 bg-black text-white font-medium rounded-lg shadow hover:bg-gray-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="mr-3 bg-black text-white p-2 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </span>
                    Send a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formStatus.error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                        {formStatus.error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          Your Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                        </svg>
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="6"
                        className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="How can I help you today?"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus.isSubmitting}
                      className="w-full px-6 py-4 bg-black text-white font-medium rounded-lg shadow hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                    >
                      {formStatus.isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}