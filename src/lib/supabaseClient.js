import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw error in non-build environments
// This prevents Netlify builds from failing when env vars aren't available at build time
if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    throw new Error('Missing Supabase environment variables')
  }
  console.warn('Missing Supabase environment variables during build')
}

// Create client only if environment variables are available
// Otherwise, return a mock client that will be replaced at runtime
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null