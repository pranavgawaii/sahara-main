import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for better TypeScript support
export interface Student {
  id: string
  email: string
  full_name: string
  student_id?: string
  created_at: string
  updated_at: string
}

export interface Counsellor {
  id: string
  email: string
  full_name: string
  license_number?: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

// Auth helper functions
export const authHelpers = {
  // Sign up a new student
  signUpStudent: async (email: string, password: string, fullName: string, studentId?: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('students')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          student_id: studentId,
        })

      if (profileError) throw profileError
    }

    return authData
  },

  // Sign up a new counsellor
  signUpCounsellor: async (email: string, password: string, fullName: string, licenseNumber?: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('counsellors')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          license_number: licenseNumber,
          is_admin: false,
        })

      if (profileError) throw profileError
    }

    return authData
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Get current user profile
  getCurrentUserProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Try to get student profile first
    const { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('id', user.id)
      .single()

    if (student) {
      return { type: 'student' as const, profile: student }
    }

    // Try to get counsellor profile
    const { data: counsellor } = await supabase
      .from('counsellors')
      .select('*')
      .eq('id', user.id)
      .single()

    if (counsellor) {
      return { type: 'counsellor' as const, profile: counsellor }
    }

    return null
  },

  // Check if user is admin
  isAdmin: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false

    const { data: counsellor } = await supabase
      .from('counsellors')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    return counsellor?.is_admin || false
  }
}