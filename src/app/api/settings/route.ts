// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/settings - Get public site settings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value, description')
      .eq('is_public', true)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch settings' },
        { status: 500 }
      )
    }

    // Transform array to object for easier access
    const settings = data?.reduce((acc: any, setting) => {
      try {
        // Try to parse JSON values
        acc[setting.key] = JSON.parse(setting.value)
      } catch {
        // If not JSON, use as string
        acc[setting.key] = setting.value
      }
      return acc
    }, {})

    return NextResponse.json({ data: settings })

  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update site settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)
    
    const body = await request.json()
    const supabase = await createClient()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object required' },
        { status: 400 }
      )
    }

    const updates = []

    for (const [key, value] of Object.entries(settings)) {
      updates.push({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        updated_at: new Date().toISOString()
      })
    }

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(updates)
      .select()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update settings error:', error)
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