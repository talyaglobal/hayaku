import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'
import { stripe } from '@/lib/stripe'
import { handleSuccessfulPayment, handleFailedPayment } from '@/lib/payments'

/**
 * POST /api/payments/confirm
 * Confirm a payment intent after client-side confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const { paymentIntentId } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Verify payment intent belongs to user
    if (
      !authUser.isAdmin &&
      paymentIntent.metadata?.user_id !== authUser.user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const orderId = paymentIntent.metadata?.order_id

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID not found in payment intent' },
        { status: 400 }
      )
    }

    // Handle payment based on status
    if (paymentIntent.status === 'succeeded') {
      await handleSuccessfulPayment(orderId, paymentIntent)
      return NextResponse.json({
        success: true,
        status: 'succeeded',
        orderId,
      })
    } else if (paymentIntent.status === 'requires_payment_method') {
      await handleFailedPayment(
        orderId,
        paymentIntent,
        paymentIntent.last_payment_error?.message || 'Payment failed'
      )
      return NextResponse.json(
        {
          success: false,
          status: 'failed',
          error: paymentIntent.last_payment_error?.message || 'Payment failed',
        },
        { status: 400 }
      )
    } else {
      return NextResponse.json({
        success: false,
        status: paymentIntent.status,
        requiresAction: paymentIntent.status === 'requires_action',
      })
    }
  } catch (error) {
    console.error('Confirm payment error:', error)
    const authError = handleAuthError(error)
    if (authError.status !== 500) {
      return authError
    }
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
