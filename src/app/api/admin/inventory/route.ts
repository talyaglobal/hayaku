// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/admin/inventory - Get inventory data (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const lowStock = searchParams.get('low_stock') === 'true'
    const productId = searchParams.get('product_id')
    
    let query = supabase
      .from('inventory')
      .select(`
        *,
        products:product_id (
          id,
          name,
          slug,
          sku,
          price,
          is_active
        )
      `)
      .order('updated_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (lowStock) {
      query = query.lt('quantity', supabase.raw('low_stock_threshold'))
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })

  } catch (error) {
    console.error('Admin inventory API error:', error)
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

// PUT /api/admin/inventory/[id] - Update inventory (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    
    const { id } = await params
    const body = await request.json()
    const supabase = await createClient()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.quantity !== undefined) updateData.quantity = body.quantity
    if (body.low_stock_threshold !== undefined) updateData.low_stock_threshold = body.low_stock_threshold
    if (body.track_inventory !== undefined) updateData.track_inventory = body.track_inventory
    if (body.allow_backorder !== undefined) updateData.allow_backorder = body.allow_backorder

    const { data, error } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        products:product_id (
          id,
          name,
          slug,
          sku
        )
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update inventory' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update inventory error:', error)
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

// POST /api/admin/inventory - Create inventory record (Admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const body = await request.json()
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('inventory')
      .insert({
        product_id: body.product_id,
        quantity: body.quantity || 0,
        low_stock_threshold: body.low_stock_threshold || 5,
        track_inventory: body.track_inventory !== false,
        allow_backorder: body.allow_backorder || false
      })
      .select(`
        *,
        products:product_id (
          id,
          name,
          slug,
          sku
        )
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create inventory record', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create inventory error:', error)
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
