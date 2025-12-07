// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/addresses/[id] - Get a specific address
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', authUser.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to fetch address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Get address error:', error)
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

// PUT /api/addresses/[id] - Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    // Verify the address belongs to the user
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!existingAddress || existingAddress.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    // If this is set as default, unset other default addresses
    if (body.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', authUser.user.id)
        .eq('is_default', true)
        .neq('id', params.id)
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .update({
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
        is_billing_address: body.is_billing_address || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', authUser.user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update address error:', error)
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

// DELETE /api/addresses/[id] - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    // Verify the address belongs to the user
    const { data: existingAddress } = await supabase
      .from('user_addresses')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!existingAddress || existingAddress.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Address not found or access denied' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', params.id)
      .eq('user_id', authUser.user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Address deleted successfully' })

  } catch (error) {
    console.error('Delete address error:', error)
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
