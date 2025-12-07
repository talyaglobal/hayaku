import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  
  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }
  
  return data
}

// Helper function to create or update user profile
export const upsertUserProfile = async (profile: {
  id: string
  full_name: string
  phone?: string
  birth_date?: string
  gender?: string
  preferred_language?: string
  preferred_currency?: string
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile as any)
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting user profile:', error)
    return null
  }
  
  return data
}

// Helper function to get user notification preferences
export const getUserNotificationPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    // If no preferences exist, return default values
    if (error.code === 'PGRST116') {
      return {
        email_notifications: true,
        sms_notifications: true,
        push_notifications: false,
        newsletter_subscription: true,
        marketing_emails: true,
        order_updates: true,
        price_alerts: false
      }
    }
    console.error('Error getting notification preferences:', error)
    return null
  }
  
  return data
}

// Helper function to update notification preferences
export const updateNotificationPreferences = async (
  userId: string,
  preferences: {
    email_notifications?: boolean
    sms_notifications?: boolean
    push_notifications?: boolean
    newsletter_subscription?: boolean
    marketing_emails?: boolean
    order_updates?: boolean
    price_alerts?: boolean
  }
) => {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .upsert({ user_id: userId, ...preferences } as any)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating notification preferences:', error)
    return null
  }
  
  return data
}