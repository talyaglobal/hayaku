// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/admin/users - Get all users (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const vipTier = searchParams.get('vip_tier') || ''
    
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        auth_users:auth.users!inner(email, created_at, last_sign_in_at)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (vipTier) {
      query = query.eq('vip_tier', vipTier)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      )
    }

    // Transform data to include email from auth.users
    const transformedData = data?.map((user: any) => ({
      ...user,
      email: user.auth_users?.email || null,
      last_sign_in_at: user.auth_users?.last_sign_in_at || null,
      auth_users: undefined
    })) || []

    return NextResponse.json({
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Admin users API error:', error)
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

// PUT /api/admin/users/[id] - Update user (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.full_name) updateData.full_name = body.full_name
    if (body.phone) updateData.phone = body.phone
    if (body.vip_tier) updateData.vip_tier = body.vip_tier
    if (body.vip_points !== undefined) updateData.vip_points = body.vip_points
    if (body.preferred_language) updateData.preferred_language = body.preferred_language
    if (body.preferred_currency) updateData.preferred_currency = body.preferred_currency

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update user error:', error)
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
