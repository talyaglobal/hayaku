// @ts-nocheck
import { supabase } from './supabase'

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    currency: string
    brand?: {
      name: string
    }
    product_images: {
      url: string
      alt_text?: string
      is_primary: boolean
    }[]
  }
}

export interface Cart {
  id: string
  user_id?: string
  session_id?: string
  created_at: string
  updated_at: string
}

// Get or create cart for user
export const getOrCreateCart = async (userId?: string, sessionId?: string) => {
  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId must be provided')
  }

  // First try to get existing cart
  let query = supabase
    .from('cart')
    .select('*')

  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    query = query.eq('session_id', sessionId)
  }

  let { data: cart, error } = await query.single()

  if (error && error.code === 'PGRST116') {
    // No cart found, create one
    const { data: newCart, error: createError } = await supabase
      .from('cart')
      .insert({
        user_id: userId || null,
        session_id: sessionId || null
      } as any)
      .select()
      .single()

    if (createError) {
      console.error('Error creating cart:', createError)
      throw createError
    }

    cart = newCart
  } else if (error) {
    console.error('Error fetching cart:', error)
    throw error
  }

  return cart
}

// Get cart items
export const getCartItems = async (userId?: string, sessionId?: string) => {
  try {
    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId)
    if (!cart) {
      throw new Error('Failed to get or create cart')
    }

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
          product_images (url, alt_text, is_primary)
        )
      `)
      .eq('cart_id', (cart as any).id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart items:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getCartItems:', error)
    return []
  }
}

// Add item to cart
export const addToCart = async (
  productId: string, 
  quantity: number = 1, 
  variantId?: string,
  userId?: string, 
  sessionId?: string
) => {
  try {
    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId)

    // Get product price
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      throw new Error('Ürün bulunamadı.')
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', (cart as any).id)
      .eq('product_id', productId)
      .eq('variant_id', variantId || null)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing cart item:', checkError)
      throw checkError
    }

    if (existingItem) {
      // Update quantity if item exists
      // @ts-ignore - Supabase type inference issue
      const { data, error } = await supabase
        .from('cart_items')
        // @ts-ignore
        .update({ 
          quantity: (existingItem as any).quantity + quantity,
          unit_price: (product as any).price 
        } as any)
        .eq('id', existingItem.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating cart item:', error)
        throw error
      }

      return data
    } else {
      // Add new item to cart
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: productId,
          variant_id: variantId || null,
          quantity: quantity,
          unit_price: product.price
        } as any)
        .select()
        .single()

      if (error) {
        console.error('Error adding to cart:', error)
        throw error
      }

      return data
    }
  } catch (error) {
    console.error('Error in addToCart:', error)
    throw error
  }
}

// Update cart item quantity
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  if (quantity <= 0) {
    return removeFromCart(itemId)
  }

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single()

    if (error) {
      console.error('Error updating cart item quantity:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error)
    throw error
  }
}

// Remove item from cart
export const removeFromCart = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in removeFromCart:', error)
    throw error
  }
}

// Get cart count
export const getCartCount = async (userId?: string, sessionId?: string) => {
  try {
    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId)

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('cart_id', (cart as any).id)

    if (error) {
      console.error('Error getting cart count:', error)
      return 0
    }

    // Sum all quantities
    const totalCount = data.reduce((sum, item) => sum + item.quantity, 0)
    return totalCount
  } catch (error) {
    console.error('Error in getCartCount:', error)
    return 0
  }
}

// Get cart total
export const getCartTotal = async (userId?: string, sessionId?: string) => {
  try {
    const items = await getCartItems(userId, sessionId)
    
    const subtotal = items.reduce((sum, item: any) => {
      return sum + (item.unit_price * item.quantity)
    }, 0)

    return {
      subtotal,
      tax: subtotal * 0.20, // 20% KDV
      shipping: subtotal >= 2000 ? 0 : 50, // Ücretsiz kargo 2000₺ üzeri
      total: subtotal + (subtotal * 0.20) + (subtotal >= 2000 ? 0 : 50)
    }
  } catch (error) {
    console.error('Error in getCartTotal:', error)
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    }
  }
}

// Clear cart
export const clearCart = async (userId?: string, sessionId?: string) => {
  try {
    // Get cart
    const cart = await getOrCreateCart(userId, sessionId)

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', (cart as any).id)

    if (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in clearCart:', error)
    throw error
  }
}

// Merge guest cart with user cart on login
export const mergeGuestCartWithUserCart = async (userId: string, sessionId: string) => {
  try {
    // Get guest cart
    const { data: guestCart } = await supabase
      .from('cart')
      .select('id')
      .eq('session_id', sessionId)
      .single()

    if (!guestCart) return

    // Get or create user cart
    const userCart = await getOrCreateCart(userId)

    // Get guest cart items
    const { data: guestItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', guestCart.id)

    if (!guestItems || guestItems.length === 0) return

    // Move items to user cart
    for (const item of guestItems) {
      // Check if item already exists in user cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_id', userCart.id)
        .eq('product_id', item.product_id)
        .eq('variant_id', item.variant_id)
        .single()

      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + item.quantity })
          .eq('id', existingItem.id)
      } else {
        // Move item to user cart
        await supabase
          .from('cart_items')
          .update({ cart_id: userCart.id })
          .eq('id', item.id)
      }
    }

    // Delete guest cart
    await supabase
      .from('cart')
      .delete()
      .eq('id', guestCart.id)

  } catch (error) {
    console.error('Error merging guest cart:', error)
  }
}