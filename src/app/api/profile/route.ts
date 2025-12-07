// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.user.id)
      .single()

    if (error) {
      // If profile doesn't exist, create a basic one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{
            id: authUser.user.id,
            full_name: user.email?.split('@')[0] || 'User',
            preferred_language: 'tr',
            preferred_currency: 'TRY'
          }])
          .select()
          .single()

        if (createError) {
          return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
          )
        }

        return NextResponse.json({ data: newProfile })
      }

      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Profile API error:', error)
    const authError = handleAuthError(error)
    if (authError.status !== 500) {
      return authError
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        birth_date: body.birth_date,
        gender: body.gender,
        preferred_language: body.preferred_language,
        preferred_currency: body.preferred_currency,
        avatar_url: body.avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', authUser.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update profile error:', error)
    const authError = handleAuthError(error)
    if (authError.status !== 500) {
      return authError
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}