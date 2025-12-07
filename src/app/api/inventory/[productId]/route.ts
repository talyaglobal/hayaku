// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getAuthUser, handleAuthError } from '@/lib/auth-server'

// GET /api/inventory/[productId] - Get inventory for a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
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
      .eq('product_id', productId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No inventory record found, return default
        return NextResponse.json({
          data: {
            product_id: productId,
            quantity: 0,
            low_stock_threshold: 5,
            track_inventory: true,
            allow_backorder: false,
            is_available: false,
            is_low_stock: false,
            is_out_of_stock: true
          }
        })
      }
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      )
    }

    // Calculate availability status
    const quantity = data.quantity || 0
    const threshold = data.low_stock_threshold || 5
    const trackInventory = data.track_inventory !== false
    const allowBackorder = data.allow_backorder || false

    const enrichedData = {
      ...data,
      is_available: trackInventory ? (quantity > 0 || allowBackorder) : true,
      is_low_stock: trackInventory && quantity > 0 && quantity <= threshold,
      is_out_of_stock: trackInventory && quantity === 0 && !allowBackorder,
      available_quantity: quantity
    }

    return NextResponse.json({ data: enrichedData })

  } catch (error) {
    console.error('Get inventory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/[productId] - Update inventory (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    const { productId } = await params
    const body = await request.json()

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.quantity !== undefined) updateData.quantity = body.quantity
    if (body.lowStockThreshold !== undefined) updateData.low_stock_threshold = body.lowStockThreshold
    if (body.trackInventory !== undefined) updateData.track_inventory = body.trackInventory
    if (body.allowBackorder !== undefined) updateData.allow_backorder = body.allowBackorder

    // Check if inventory record exists
    const { data: existing } = await supabase
      .from('inventory')
      .select('id')
      .eq('product_id', productId)
      .single()

    let result
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          product_id: productId,
          quantity: body.quantity || 0,
          low_stock_threshold: body.lowStockThreshold || 5,
          track_inventory: body.trackInventory !== undefined ? body.trackInventory : true,
          allow_backorder: body.allowBackorder || false,
          ...updateData
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

    // Check for low stock alert
    if (result.data && result.data.track_inventory) {
      const currentQuantity = result.data.quantity || 0
      const threshold = result.data.low_stock_threshold || 5

      if (currentQuantity <= threshold && currentQuantity > 0) {
        // Trigger low stock alert check
        console.log(`Low stock alert triggered for product ${productId}`)
      }
    }

    return NextResponse.json({ data: result.data })

  } catch (error) {
    console.error('Update inventory error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
