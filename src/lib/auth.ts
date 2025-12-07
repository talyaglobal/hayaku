'use client'

import { createClient } from './supabase-browser'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export interface AuthState {
  user: User | null
  loading: boolean
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// Reset password
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Update password
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// Get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return session
}

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const session = await getCurrentSession()
    return !!session?.user
  } catch {
    return false
  }
}

// Get user profile after sign up
export const createUserProfile = async (user: User) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email || '',
      preferred_language: 'tr' as 'tr' | 'en',
      preferred_currency: 'TRY' as 'TRY' | 'USD' | 'EUR',
    } as any)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating user profile:', error)
    return null
  }
  
  return data
}