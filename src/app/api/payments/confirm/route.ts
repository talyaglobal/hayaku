import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { paymentIntentId, items, shippingAddress, billingAddress } = await request.json()

    // Retrieve the payment intent to confirm it's successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not confirmed' }, { status: 400 })
    }

    // Create order in database
    const orderData = {
      user_id: user.id,
      order_number: `HAY-${Date.now()}`,
      status: 'processing',
      subtotal: paymentIntent.amount / 100,
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
      total_amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      payment_status: 'paid',
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_sku: item.sku || '',
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Sync inventory after order is placed
    try {
      const inventoryResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/inventory/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          items: orderItems
        })
      })
      
      if (!inventoryResponse.ok) {
        console.error('Failed to sync inventory')
      }
    } catch (syncError) {
      console.error('Inventory sync error:', syncError)
      // Don't fail the order if inventory sync fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error: any) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}