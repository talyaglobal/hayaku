import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.log(`❌ Webhook signature verification failed.`, err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log(`💰 PaymentIntent ${paymentIntent.id} succeeded!`)
        
        // Update order payment status
        await supabase
          .from('orders')
          .update({ payment_status: 'paid', status: 'processing' })
          .eq('id', paymentIntent.metadata.orderId)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log(`❌ Payment ${failedPayment.id} failed!`)
        
        // Update order payment status
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('id', failedPayment.metadata.orderId)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}