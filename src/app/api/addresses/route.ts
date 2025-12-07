// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/addresses - Get all user addresses
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', authUser.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })

  } catch (error) {
    console.error('Addresses API error:', error)
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

// POST /api/addresses - Create a new address
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    // If this is set as default, unset other default addresses
    if (body.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', authUser.user.id)
        .eq('is_default', true)
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert([{
        user_id: authUser.user.id,
        title: body.title,
        full_name: body.full_name,
        phone: body.phone,
        address_line_1: body.address_line_1,
        address_line_2: body.address_line_2 || null,
        city: body.city,
        state: body.state,
        postal_code: body.postal_code,
        country: body.country || 'TR',
        is_default: body.is_default || false,
        is_billing_address: body.is_billing_address || false
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create address error:', error)
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
