// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/admin/orders - Get all orders (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          products:product_id (
            id,
            name,
            slug
          )
        ),
        user_profiles:user_id (
          id,
          full_name,
          email:auth.users!inner(email)
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Admin orders API error:', error)
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
