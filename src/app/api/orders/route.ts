// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'
import { sendOrderConfirmationEmail } from '@/lib/email'

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = await createClient()
    
    // Build query - users can only see their own orders unless they're admin
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            product_images (url, is_primary)
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // If not admin, filter by user_id
    if (!authUser.isAdmin) {
      query = query.eq('user_id', authUser.user.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    // Calculate pagination
    const total = count || 0
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Orders API error:', error)
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

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    
    const body = await request.json()
    const supabase = await createClient()
    
    const {
      items,
      shipping_address,
      billing_address,
      payment_method
    } = body

    if (!items || !items.length) {
      return NextResponse.json(
        { error: 'Order items are required' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`
    
    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const taxAmount = subtotal * 0.20 // 20% tax
    const shippingAmount = subtotal > 2000 ? 0 : 50 // Free shipping over 2000 TRY
    const totalAmount = subtotal + taxAmount + shippingAmount

    // Extract email and phone from shipping address
    const email = shipping_address?.email || authUser.user.email || ''
    const phone = shipping_address?.phone || ''

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: authUser.user.id,
        order_number: orderNumber,
        email,
        phone,
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        currency: 'TRY',
        shipping_address,
        billing_address,
        status: 'pending',
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled'
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Log initial status to order_status_history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: order.id,
        from_status: null,
        to_status: 'pending',
        notes: 'Order created',
        created_by: authUser.user.id
      })
      .catch(err => console.error('Failed to log initial status history:', err))

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      product_name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      quantity_fulfilled: 0,
      fulfillment_status: 'unfulfilled'
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    // Get order with items for email
    const { data: orderWithItems } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', order.id)
      .single()

    // Send order confirmation email (async, don't wait)
    if (orderWithItems && email) {
      sendOrderConfirmationEmail({
        orderNumber: order.order_number,
        customerName: `${shipping_address?.first_name || ''} ${shipping_address?.last_name || ''}`.trim() || authUser.user.email?.split('@')[0] || 'Müşteri',
        customerEmail: email,
        orderDate: order.created_at,
        items: orderItems.map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        })),
        subtotal: order.subtotal,
        tax: order.tax_amount,
        shipping: order.shipping_amount,
        total: order.total_amount,
        currency: order.currency,
        shippingAddress: shipping_address || {}
      }).catch(err => console.error('Failed to send confirmation email:', err))
    }

    return NextResponse.json({ 
      data: {
        ...order,
        items: orderItems
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Create order error:', error)
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