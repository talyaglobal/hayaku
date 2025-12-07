// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, requireAuth, handleAuthError } from '@/lib/auth-server'
import { sendOrderStatusUpdateEmail, sendOrderCancellationEmail } from '@/lib/email'

// GET /api/orders/[id] - Get single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authUser = await requireAuth(request)
    const { id } = await params

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
            slug,
            brands (name),
            product_images (url, is_primary)
          )
        ),
        order_status_history (
          id,
          from_status,
          to_status,
          notes,
          created_at,
          created_by
        )
      `)
      .eq('id', id)

    // If not admin, filter by user_id
    if (!authUser.isAdmin) {
      query = query.eq('user_id', authUser.user.id)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Get order error:', error)
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

// PUT /api/orders/[id] - Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const authUser = await requireAdmin(request)
    
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()
    
    const { 
      status, 
      payment_status, 
      fulfillment_status,
      tracking_number, 
      shipping_date, 
      delivery_date,
      notes 
    } = body

    // Get current order to check previous status
    const { data: currentOrder } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single()

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const previousStatus = currentOrder.status
    const previousPaymentStatus = currentOrder.payment_status
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (fulfillment_status) updateData.fulfillment_status = fulfillment_status
    if (tracking_number) updateData.tracking_number = tracking_number
    if (shipping_date) updateData.shipping_date = shipping_date
    if (delivery_date) updateData.delivery_date = delivery_date

    // Calculate fulfillment status based on order items if not explicitly provided
    if (!fulfillment_status && currentOrder.order_items) {
      const totalItems = currentOrder.order_items.length
      const fulfilledItems = currentOrder.order_items.filter(
        (item: any) => item.fulfillment_status === 'fulfilled'
      ).length
      
      if (fulfilledItems === 0) {
        updateData.fulfillment_status = 'unfulfilled'
      } else if (fulfilledItems === totalItems) {
        updateData.fulfillment_status = 'fulfilled'
      } else {
        updateData.fulfillment_status = 'partial'
      }
    }

    // Update order
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    // Log status change to order_status_history
    if (status && status !== previousStatus) {
      await supabase
        .from('order_status_history')
        .insert({
          order_id: id,
          from_status: previousStatus,
          to_status: status,
          notes: notes || `Status changed from ${previousStatus} to ${status}`,
          created_by: authUser.user.id
        })
        .catch(err => console.error('Failed to log status history:', err))
    }

    // Log payment status change
    if (payment_status && payment_status !== previousPaymentStatus) {
      await supabase
        .from('order_status_history')
        .insert({
          order_id: id,
          from_status: previousPaymentStatus,
          to_status: payment_status,
          notes: notes || `Payment status changed from ${previousPaymentStatus} to ${payment_status}`,
          created_by: authUser.user.id
        })
        .catch(err => console.error('Failed to log payment status history:', err))
    }

    // Handle inventory deduction when order is confirmed/processing
    // Inventory is deducted when order moves to confirmed/processing status
    if (status && ['confirmed', 'processing'].includes(status) && !['confirmed', 'processing'].includes(previousStatus)) {
      // Deduct inventory for each order item
      for (const item of currentOrder.order_items || []) {
        if (item.product_id) {
          // Check for variant-specific inventory first, then product-level inventory
          let inventoryQuery = supabase
            .from('inventory')
            .select('id, quantity, track_inventory, variant_id')
            .eq('product_id', item.product_id)
          
          if (item.variant_id) {
            inventoryQuery = inventoryQuery.eq('variant_id', item.variant_id)
          } else {
            inventoryQuery = inventoryQuery.is('variant_id', null)
          }

          const { data: inventory } = await inventoryQuery.single()

          if (inventory && inventory.track_inventory) {
            const currentQuantity = inventory.quantity || 0
            if (currentQuantity < item.quantity && !inventory.allow_backorder) {
              console.warn(`Insufficient inventory for product ${item.product_id}. Available: ${currentQuantity}, Required: ${item.quantity}`)
            }
            
            const newQuantity = Math.max(0, currentQuantity - item.quantity)
            await supabase
              .from('inventory')
              .update({ 
                quantity: newQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', inventory.id)
          } else if (!inventory) {
            console.warn(`Inventory record not found for product ${item.product_id}${item.variant_id ? ` variant ${item.variant_id}` : ''}`)
          }
        }
      }
    }

    // Handle inventory deduction on order completion (when shipped or delivered)
    // This ensures inventory is deducted even if order goes directly to shipped/delivered
    if (status && ['shipped', 'delivered'].includes(status) && !['shipped', 'delivered'].includes(previousStatus)) {
      // Only deduct if inventory wasn't already deducted (order wasn't confirmed/processing)
      if (!['confirmed', 'processing'].includes(previousStatus)) {
        for (const item of currentOrder.order_items || []) {
          if (item.product_id) {
            let inventoryQuery = supabase
              .from('inventory')
              .select('id, quantity, track_inventory, variant_id')
              .eq('product_id', item.product_id)
            
            if (item.variant_id) {
              inventoryQuery = inventoryQuery.eq('variant_id', item.variant_id)
            } else {
              inventoryQuery = inventoryQuery.is('variant_id', null)
            }

            const { data: inventory } = await inventoryQuery.single()

            if (inventory && inventory.track_inventory) {
              const newQuantity = Math.max(0, (inventory.quantity || 0) - item.quantity)
              await supabase
                .from('inventory')
                .update({ 
                  quantity: newQuantity,
                  updated_at: new Date().toISOString()
                })
                .eq('id', inventory.id)
            }
          }
        }
      }
    }

    // Handle inventory restoration when order is cancelled/refunded
    if (status && ['cancelled', 'refunded'].includes(status) && !['cancelled', 'refunded'].includes(previousStatus)) {
      // Only restore inventory if order was previously confirmed/processing/shipped (inventory was deducted)
      if (['confirmed', 'processing', 'shipped', 'delivered'].includes(previousStatus)) {
        // Restore inventory for each order item
        for (const item of currentOrder.order_items || []) {
          if (item.product_id) {
            let inventoryQuery = supabase
              .from('inventory')
              .select('id, quantity, track_inventory, variant_id')
              .eq('product_id', item.product_id)
            
            if (item.variant_id) {
              inventoryQuery = inventoryQuery.eq('variant_id', item.variant_id)
            } else {
              inventoryQuery = inventoryQuery.is('variant_id', null)
            }

            const { data: inventory } = await inventoryQuery.single()

            if (inventory && inventory.track_inventory) {
              const newQuantity = (inventory.quantity || 0) + item.quantity
              await supabase
                .from('inventory')
                .update({ 
                  quantity: newQuantity,
                  updated_at: new Date().toISOString()
                })
                .eq('id', inventory.id)
            } else if (!inventory) {
              console.warn(`Inventory record not found for product ${item.product_id}${item.variant_id ? ` variant ${item.variant_id}` : ''} during restoration`)
            }
          }
        }
      }
    }

    // Send status update email if status changed
    if (status && status !== previousStatus && updatedOrder.email) {
      const shippingAddress = updatedOrder.shipping_address || {}
      sendOrderStatusUpdateEmail({
        orderNumber: updatedOrder.order_number,
        customerName: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || updatedOrder.email.split('@')[0],
        customerEmail: updatedOrder.email,
        orderDate: updatedOrder.created_at,
        items: (updatedOrder.order_items || []).map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        })),
        subtotal: updatedOrder.subtotal,
        tax: updatedOrder.tax_amount,
        shipping: updatedOrder.shipping_amount,
        total: updatedOrder.total_amount,
        currency: updatedOrder.currency,
        shippingAddress: shippingAddress,
        trackingNumber: updatedOrder.tracking_number,
        status: updatedOrder.status
      }).catch(err => console.error('Failed to send status update email:', err))
    }

    return NextResponse.json({ data: updatedOrder })

  } catch (error) {
    console.error('Update order error:', error)
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

// DELETE /api/orders/[id] - Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    // Get order with items
    const { data: order } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
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

    // Only allow canceling pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Only pending or confirmed orders can be cancelled' },
        { status: 400 }
      )
    }

    // Get cancellation reason from request body if provided
    let reason = 'Müşteri talebi'
    try {
      const body = await request.json()
      if (body?.reason) {
        reason = body.reason
      }
    } catch {
      // No body provided, use default reason
    }

    // Update order status
    const { data: cancelledOrder, error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        payment_status: order.payment_status === 'paid' ? 'refunded' : 'voided',
        fulfillment_status: 'unfulfilled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to cancel order' },
        { status: 500 }
      )
    }

    // Log status change to order_status_history
    await supabase
      .from('order_status_history')
      .insert({
        order_id: id,
        from_status: order.status,
        to_status: 'cancelled',
        notes: reason || 'Order cancelled by customer',
        created_by: authUser.user.id
      })
      .catch(err => console.error('Failed to log cancellation status history:', err))

    // Restore inventory if order was confirmed/processing/shipped (inventory was deducted)
    if (['confirmed', 'processing', 'shipped'].includes(order.status)) {
      for (const item of order.order_items || []) {
        if (item.product_id) {
          const { data: inventory } = await supabase
            .from('inventory')
            .select('quantity, track_inventory')
            .eq('product_id', item.product_id)
            .single()

          if (inventory && inventory.track_inventory) {
            const newQuantity = (inventory.quantity || 0) + item.quantity
            await supabase
              .from('inventory')
              .update({ quantity: newQuantity })
              .eq('product_id', item.product_id)
          } else if (!inventory) {
            console.warn(`Inventory record not found for product ${item.product_id} during cancellation`)
          }
        }
      }
    }

    // Send cancellation email
    if (order.email) {
      const shippingAddress = order.shipping_address || {}
      sendOrderCancellationEmail({
        orderNumber: order.order_number,
        customerName: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim() || order.email.split('@')[0],
        customerEmail: order.email,
        orderDate: order.created_at,
        items: (order.order_items || []).map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        })),
        subtotal: order.subtotal,
        tax: order.tax_amount,
        shipping: order.shipping_amount,
        total: order.total_amount,
        currency: order.currency,
        shippingAddress: shippingAddress,
        status: 'cancelled',
        payment_status: cancelledOrder.payment_status
      }, reason).catch(err => console.error('Failed to send cancellation email:', err))
    }

    return NextResponse.json({ 
      message: 'Order cancelled successfully',
      data: cancelledOrder
    })

  } catch (error) {
    console.error('Cancel order error:', error)
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