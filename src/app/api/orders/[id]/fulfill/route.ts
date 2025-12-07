// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// POST /api/orders/[id]/fulfill - Fulfill order items (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const authUser = await requireAdmin(request)
    
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()
    
    const { item_id, quantity_fulfilled } = body

    // Get current order
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

    // If item_id is provided, fulfill specific item
    if (item_id) {
      const item = order.order_items.find((item: any) => item.id === item_id)
      if (!item) {
        return NextResponse.json(
          { error: 'Order item not found' },
          { status: 404 }
        )
      }

      const fulfilledQty = quantity_fulfilled || item.quantity
      const newFulfilledQty = Math.min(fulfilledQty, item.quantity)
      const isFullyFulfilled = newFulfilledQty >= item.quantity

      // Update order item fulfillment
      const { error: updateError } = await supabase
        .from('order_items')
        .update({
          quantity_fulfilled: newFulfilledQty,
          fulfillment_status: isFullyFulfilled ? 'fulfilled' : 'unfulfilled'
        })
        .eq('id', item_id)

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update order item fulfillment' },
          { status: 500 }
        )
      }
    } else {
      // Fulfill all items
      for (const item of order.order_items || []) {
        await supabase
          .from('order_items')
          .update({
            quantity_fulfilled: item.quantity,
            fulfillment_status: 'fulfilled'
          })
          .eq('id', item.id)
      }
    }

    // Recalculate order fulfillment status
    const { data: updatedOrder } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single()

    if (updatedOrder && updatedOrder.order_items) {
      const totalItems = updatedOrder.order_items.length
      const fulfilledItems = updatedOrder.order_items.filter(
        (item: any) => item.fulfillment_status === 'fulfilled'
      ).length
      
      let newFulfillmentStatus = 'unfulfilled'
      if (fulfilledItems === totalItems) {
        newFulfillmentStatus = 'fulfilled'
      } else if (fulfilledItems > 0) {
        newFulfillmentStatus = 'partial'
      }

      await supabase
        .from('orders')
        .update({ 
          fulfillment_status: newFulfillmentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
    }

    // Get updated order
    const { data: finalOrder } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single()

    return NextResponse.json({ data: finalOrder })

  } catch (error) {
    console.error('Fulfill order error:', error)
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
