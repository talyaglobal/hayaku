// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getAuthUser, handleAuthError } from '@/lib/auth-server'

// GET /api/inventory - Get inventory for products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const lowStock = searchParams.get('lowStock') === 'true'
    const outOfStock = searchParams.get('outOfStock') === 'true'
    const supabase = await createClient()

    let query = supabase
      .from('inventory')
      .select(`
        *,
        products:product_id (
          id,
          name,
          sku,
          is_active
        )
      `)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (lowStock) {
      query = query.lte('quantity', supabase.raw('low_stock_threshold'))
        .eq('track_inventory', true)
    }

    if (outOfStock) {
      query = query.eq('quantity', 0)
        .eq('track_inventory', true)
        .eq('allow_backorder', false)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Inventory API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/inventory - Create or update inventory (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return handleAuthError()
    }

    // Check if user is admin
    const supabase = await createClient()
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('id', authUser.user.id)
      .eq('is_active', true)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, quantity, lowStockThreshold, trackInventory, allowBackorder } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if inventory record exists
    const { data: existing } = await supabase
      .from('inventory')
      .select('id')
      .eq('product_id', productId)
      .single()

    let result
    if (existing) {
      // Update existing inventory
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (quantity !== undefined) updateData.quantity = quantity
      if (lowStockThreshold !== undefined) updateData.low_stock_threshold = lowStockThreshold
      if (trackInventory !== undefined) updateData.track_inventory = trackInventory
      if (allowBackorder !== undefined) updateData.allow_backorder = allowBackorder

      const { data, error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new inventory record
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          product_id: productId,
          quantity: quantity || 0,
          low_stock_threshold: lowStockThreshold || 5,
          track_inventory: trackInventory !== undefined ? trackInventory : true,
          allow_backorder: allowBackorder || false
        }])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to update inventory', details: result.error.message },
        { status: 500 }
      )
    }

    // Check if low stock alert should be triggered
    if (result.data && result.data.track_inventory) {
      const currentQuantity = result.data.quantity || 0
      const threshold = result.data.low_stock_threshold || 5

      if (currentQuantity <= threshold && currentQuantity > 0) {
        // Trigger low stock alert (will be handled by database trigger or separate endpoint)
        await checkAndSendLowStockAlert(supabase, result.data.product_id)
      }
    }

    return NextResponse.json({ data: result.data }, { status: existing ? 200 : 201 })

  } catch (error) {
    console.error('Create/Update inventory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to check and send low stock alerts
async function checkAndSendLowStockAlert(supabase: any, productId: string) {
  try {
    // This will be called by the low stock alerts endpoint
    // For now, we'll just log it
    console.log(`Low stock alert triggered for product ${productId}`)
  } catch (error) {
    console.error('Error checking low stock alert:', error)
  }
}
