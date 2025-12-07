import { createClient } from './supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  user: User
  isAdmin: boolean
  role?: string
}

/**
 * Get the authenticated user from the request
 * Returns null if not authenticated
 */
export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role, is_active')
      .eq('id', user.id)
      .eq('is_active', true)
      .single()

    const isAdmin = !!adminUser
    const role = adminUser ? (adminUser as any).role : undefined

    return {
      user,
      isAdmin,
      role
    }
  } catch (error) {
    console.error('Error getting auth user:', error)
    return null
  }
}

/**
 * Require authentication - returns user or throws 401
 */
export async function requireAuth(request?: NextRequest): Promise<AuthUser> {
  const authUser = await getAuthUser(request)
  
  if (!authUser) {
    throw new Error('UNAUTHORIZED')
  }
  
  return authUser
}

/**
 * Require admin role - returns admin user or throws 403
 */
export async function requireAdmin(request?: NextRequest): Promise<AuthUser> {
  const authUser = await requireAuth(request)
  
  if (!authUser.isAdmin) {
    throw new Error('FORBIDDEN')
  }
  
  return authUser
}

/**
 * Handle authentication errors in API routes
 */
export function handleAuthError(error: unknown): NextResponse {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
