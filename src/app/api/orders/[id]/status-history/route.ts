// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/orders/[id]/status-history - Get order status history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    const { id } = await params

    const supabase = await createClient()
    
    // Verify user has access to this order
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user owns the order or is admin
    if (!authUser.isAdmin && order.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Get status history
    const { data, error } = await supabase
      .from('order_status_history')
      .select(`
        *,
        created_by_user:created_by (
          id,
          email
        )
      `)
      .eq('order_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch status history' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })

  } catch (error) {
    console.error('Get status history error:', error)
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
