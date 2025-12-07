import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { handleSuccessfulPayment, handleFailedPayment } from '@/lib/payments'
import { headers } from 'next/headers'

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await handleSuccessfulPayment(orderId, paymentIntent)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await handleFailedPayment(
            orderId,
            paymentIntent,
            paymentIntent.last_payment_error?.message
          )
        }
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as any
        const orderId = paymentIntent.metadata?.order_id

        if (orderId) {
          await handleFailedPayment(orderId, paymentIntent, 'Payment canceled')
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any
        const paymentIntentId = charge.payment_intent

        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          )
          const orderId = paymentIntent.metadata?.order_id

          if (orderId) {
            // Handle refund
            const { storePaymentTransaction, updateOrderPaymentStatus } =
              await import('@/lib/payments')
            await storePaymentTransaction(orderId, {
              type: charge.refunded ? 'refund' : 'partial_refund',
              status: 'succeeded',
              amount: charge.amount_refunded / 100,
              currency: charge.currency,
              provider: 'stripe',
              providerTransactionId: charge.id,
              gatewayResponse: charge,
              processedAt: new Date(),
            })

            await updateOrderPaymentStatus(orderId, 'refunded')
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
