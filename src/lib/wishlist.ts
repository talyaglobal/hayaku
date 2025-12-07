import { supabase } from './supabase'

export interface WishlistItem {
  id: string
  wishlist_id: string
  product_id: string
  variant_id?: string
  added_at: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_price?: number
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

export interface Wishlist {
  id: string
  user_id: string
  name: string
  is_default: boolean
  is_private: boolean
  created_at: string
  updated_at: string
}

// Get or create default wishlist for user
export const getOrCreateDefaultWishlist = async (userId: string): Promise<Wishlist> => {
  // First try to get existing default wishlist
  let { data: wishlist, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single()

  if (error && error.code === 'PGRST116') {
    // No default wishlist found, create one
    const { data: newWishlist, error: createError } = await supabase
      .from('wishlists')
      .insert({
        user_id: userId,
        name: 'Favorilerim',
        is_default: true,
        is_private: true
      } as any)
      .select()
      .single()

    if (createError) {
      console.error('Error creating default wishlist:', createError)
      throw createError
    }

    wishlist = newWishlist
  } else if (error) {
    console.error('Error fetching default wishlist:', error)
    throw error
  }

  return wishlist
}

// Get user's wishlist items
export const getWishlistItems = async (userId: string) => {
  // First get or create default wishlist
  const wishlist = await getOrCreateDefaultWishlist(userId)
  
  if (!wishlist) {
    return []
  }

  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      *,
      products:product_id (
        id,
        name,
        slug,
        price,
        compare_price,
        currency,
        brands:brand_id (name),
        product_images (url, alt_text, is_primary)
      )
    `)
    .eq('wishlist_id', wishlist.id)
    .order('added_at', { ascending: false })

  if (error) {
    console.error('Error fetching wishlist items:', error)
    return []
  }

  return data || []
}

// Add item to wishlist
export const addToWishlist = async (userId: string, productId: string, variantId?: string) => {
  try {
    // Get or create default wishlist
    const wishlist = await getOrCreateDefaultWishlist(userId)
    
    if (!wishlist) {
      return { success: false, error: 'Failed to get wishlist' }
    }

    // Check if item already exists
    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', productId)
      .eq('variant_id', variantId || null)
      .single()

    if (existing) {
      throw new Error('Bu ürün zaten favorilerinizde bulunuyor.')
    }

    // Add item to wishlist
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert({
        wishlist_id: wishlist.id,
        product_id: productId,
        variant_id: variantId || null
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in addToWishlist:', error)
    throw error
  }
}

// Remove item from wishlist
export const removeFromWishlist = async (userId: string, productId: string, variantId?: string) => {
  try {
    // Get default wishlist
    const wishlist = await getOrCreateDefaultWishlist(userId)
    
    if (!wishlist) {
      return { success: false, error: 'Failed to get wishlist' }
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', productId)
      .eq('variant_id', variantId || null)

    if (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in removeFromWishlist:', error)
    throw error
  }
}

// Check if item is in wishlist
export const isInWishlist = async (userId: string, productId: string, variantId?: string) => {
  try {
    // Get default wishlist
    const wishlist = await getOrCreateDefaultWishlist(userId)
    
    if (!wishlist) {
      return false
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('wishlist_id', wishlist.id)
      .eq('product_id', productId)
      .eq('variant_id', variantId || null)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking wishlist:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isInWishlist:', error)
    return false
  }
}

// Get wishlist count for user
export const getWishlistCount = async (userId: string) => {
  try {
    // Get default wishlist
    const wishlist = await getOrCreateDefaultWishlist(userId)
    
    if (!wishlist) {
      return 0
    }

    const { count, error } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('wishlist_id', wishlist.id)

    if (error) {
      console.error('Error getting wishlist count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getWishlistCount:', error)
    return 0
  }
}

// Clear entire wishlist
export const clearWishlist = async (userId: string) => {
  try {
    // Get default wishlist
    const wishlist = await getOrCreateDefaultWishlist(userId)
    
    if (!wishlist) {
      return { success: false, error: 'Failed to get wishlist' }
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('wishlist_id', wishlist.id)

    if (error) {
      console.error('Error clearing wishlist:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in clearWishlist:', error)
    throw error
  }
}