// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getAuthUser, handleAuthError } from '@/lib/auth-server'

// GET /api/cart - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const supabase = await createClient()

    if (!authUser && !sessionId) {
      return NextResponse.json(
        { error: 'User session or session ID required' },
        { status: 401 }
      )
    }

    // Find or create cart
    let cartQuery = supabase.from('cart').select('id')
    
    if (authUser) {
      cartQuery = cartQuery.eq('user_id', authUser.user.id)
    } else {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: carts } = await cartQuery
    
    if (!carts || carts.length === 0) {
      return NextResponse.json({ data: [] })
    }

    const cartId = carts[0].id

    // Get cart items with product details and inventory
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (
          id,
          name,
          slug,
          price,
          currency,
          brands:brand_id (name),
          product_images!inner (url, alt_text, is_primary),
          inventory:inventory (
            quantity,
            track_inventory,
            allow_backorder
          )
        )
      `)
      .eq('cart_id', cartId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    const body = await request.json()
    const { productId, quantity = 1, sessionId } = body
    const supabase = await createClient()

    if (!authUser && !sessionId) {
      return NextResponse.json(
        { error: 'User session or session ID required' },
        { status: 401 }
      )
    }

    // Get product details with inventory
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        price,
        is_active,
        inventory:inventory (
          quantity,
          track_inventory,
          allow_backorder
        )
      `)
      .eq('id', productId)
      .single()

    if (productError || !product || !product.is_active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    // Check inventory availability
    const inventory = product.inventory?.[0] || null
    const trackInventory = inventory?.track_inventory !== false
    const allowBackorder = inventory?.allow_backorder || false
    const availableQuantity = inventory?.quantity || 0

    // Calculate total quantity in cart (including what we're about to add)
    let totalCartQuantity = quantity
    const { data: existingItems } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('product_id', productId)

    if (existingItems && existingItems.length > 0) {
      totalCartQuantity += existingItems.reduce((sum, item) => sum + item.quantity, 0)
    }

    // Check stock availability
    if (trackInventory) {
      if (availableQuantity === 0 && !allowBackorder) {
        return NextResponse.json(
          { 
            error: 'Product is out of stock',
            code: 'OUT_OF_STOCK',
            availableQuantity: 0,
            allowPreOrder: false
          },
          { status: 400 }
        )
      }

      if (availableQuantity > 0 && totalCartQuantity > availableQuantity && !allowBackorder) {
        return NextResponse.json(
          { 
            error: `Only ${availableQuantity} items available in stock`,
            code: 'INSUFFICIENT_STOCK',
            availableQuantity,
            requestedQuantity: totalCartQuantity,
            allowPreOrder: false
          },
          { status: 400 }
        )
      }

      // If backorder is allowed and stock is 0, this is a pre-order
      if (availableQuantity === 0 && allowBackorder) {
        // Pre-order is allowed, continue
      }
    }

    // Find or create cart
    let cart
    let cartQuery = supabase.from('cart').select('id')
    
    if (authUser) {
      cartQuery = cartQuery.eq('user_id', authUser.user.id)
    } else {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: existingCarts } = await cartQuery

    if (existingCarts && existingCarts.length > 0) {
      cart = existingCarts[0]
    } else {
      // Create new cart
      const { data: newCart, error: cartError } = await supabase
        .from('cart')
        .insert([{
          user_id: authUser?.user.id || null,
          session_id: !authUser ? sessionId : null
        }])
        .select('id')
        .single()

      if (cartError) {
        return NextResponse.json(
          { error: 'Failed to create cart' },
          { status: 500 }
        )
      }

      cart = newCart
    }

    // Check if item already exists in cart
    const { data: existingCartItems } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)

    let result
    if (existingCartItems && existingCartItems.length > 0) {
      // Update existing item quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingCartItems[0].quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCartItems[0].id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Add new item to cart
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          product_id: productId,
          quantity,
          unit_price: product.price
        }])
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to add item to cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: result.data }, { status: 201 })

  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}