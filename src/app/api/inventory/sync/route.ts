// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getAuthUser, handleAuthError } from '@/lib/auth-server'

// POST /api/inventory/sync - Synchronize stock from external systems (Admin only)
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
    const { 
      source, // 'netsis', 'logo', 'sap', 'manual', etc.
      updates // Array of { productId or sku, quantity, ... }
    } = body

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    for (const update of updates) {
      try {
        let productId = update.productId

        // If SKU is provided instead of productId, find the product
        if (!productId && update.sku) {
          const { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('sku', update.sku)
            .single()

          if (!product) {
            errors.push({ sku: update.sku, error: 'Product not found' })
            continue
          }
          productId = product.id
        }

        if (!productId) {
          errors.push({ update, error: 'Product ID or SKU required' })
          continue
        }

        // Check if inventory record exists
        const { data: existing } = await supabase
          .from('inventory')
          .select('id, quantity')
          .eq('product_id', productId)
          .single()

        const syncData: any = {
          updated_at: new Date().toISOString()
        }

        if (update.quantity !== undefined) {
          syncData.quantity = update.quantity
        }
        if (update.lowStockThreshold !== undefined) {
          syncData.low_stock_threshold = update.lowStockThreshold
        }

        let result
        if (existing) {
          // Update existing inventory
          const { data, error } = await supabase
            .from('inventory')
            .update(syncData)
            .eq('id', existing.id)
            .select()
            .single()

          if (error) {
            errors.push({ productId, error: error.message })
            continue
          }

          result = {
            productId,
            action: 'updated',
            previousQuantity: existing.quantity,
            newQuantity: data.quantity,
            data
          }
        } else {
          // Create new inventory record
          const { data, error } = await supabase
            .from('inventory')
            .insert([{
              product_id: productId,
              quantity: update.quantity || 0,
              low_stock_threshold: update.lowStockThreshold || 5,
              track_inventory: true,
              allow_backorder: update.allowBackorder || false,
              ...syncData
            }])
            .select()
            .single()

          if (error) {
            errors.push({ productId, error: error.message })
            continue
          }

          result = {
            productId,
            action: 'created',
            newQuantity: data.quantity,
            data
          }
        }

        results.push(result)

      } catch (error: any) {
        errors.push({ update, error: error.message || 'Unknown error' })
      }
    }

    return NextResponse.json({
      message: 'Stock synchronization completed',
      source,
      synced: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    }, { status: errors.length === updates.length ? 500 : 200 })

  } catch (error) {
    console.error('Stock sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
