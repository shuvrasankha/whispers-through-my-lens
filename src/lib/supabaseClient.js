import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yywgadreuosyccwcjmil.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5d2dhZHJldW9zeWNjd2NqbWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MTAyMTMsImV4cCI6MjA2MTM4NjIxM30.mxjv34I6UKBUynasYjYaXdndXwyNb_HpwDNDEoc0PRU"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)