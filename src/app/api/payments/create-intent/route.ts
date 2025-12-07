import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'
import { createPaymentIntent } from '@/lib/payments'
import { createClient } from '@/lib/supabase-server'

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent for an order
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, total_amount, currency, payment_status, user_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if user owns the order (unless admin)
    if (!authUser.isAdmin && order.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order is already paid' },
        { status: 400 }
      )
    }

    // Create payment intent
    const { clientSecret, paymentIntentId } = await createPaymentIntent({
      orderId: order.id,
      amount: order.total_amount,
      currency: order.currency || 'try',
      metadata: {
        user_id: authUser.user.id,
        order_number: order.order_number || order.id,
      },
    })

    return NextResponse.json({
      clientSecret,
      paymentIntentId,
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    const authError = handleAuthError(error)
    if (authError.status !== 500) {
      return authError
    }
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
