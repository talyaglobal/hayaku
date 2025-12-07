// @ts-nocheck
import { supabase } from './supabase'

export interface Hashtag {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
}

export interface ProductHashtag {
  id: string
  product_id: string
  hashtag_id: string
  created_at: string
}

// Get all hashtags
export const getHashtags = async (activeOnly = true) => {
  let query = supabase
    .from('hashtags')
    .select('*')
    .order('usage_count', { ascending: false })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching hashtags:', error)
    return []
  }

  return data || []
}

// Get hashtag by slug
export const getHashtagBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching hashtag:', error)
    return null
  }

  return data
}

// Create hashtag
export const createHashtag = async (hashtagData: {
  name: string
  slug: string
  description?: string
  color?: string
  is_active?: boolean
}) => {
  const { data, error } = await supabase
    .from('hashtags')
    .insert(hashtagData)
    .select()
    .single()

  if (error) {
    console.error('Error creating hashtag:', error)
    throw error
  }

  return data
}

// Update hashtag
export const updateHashtag = async (id: string, hashtagData: Partial<Hashtag>) => {
  const { data, error } = await supabase
    .from('hashtags')
    .update(hashtagData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating hashtag:', error)
    throw error
  }

  return data
}

// Delete hashtag
export const deleteHashtag = async (id: string) => {
  // First remove from products
  await supabase
    .from('product_hashtags')
    .delete()
    .eq('hashtag_id', id)

  // Then delete hashtag
  const { error } = await supabase
    .from('hashtags')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting hashtag:', error)
    throw error
  }
}

// Get hashtags for a product
export const getProductHashtags = async (productId: string) => {
  const { data, error } = await supabase
    .from('product_hashtags')
    .select(`
      *,
      hashtags:hashtag_id (*)
    `)
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching product hashtags:', error)
    return []
  }

  return data || []
}

// Add hashtag to product
export const addHashtagToProduct = async (productId: string, hashtagId: string) => {
  const { data, error } = await supabase
    .from('product_hashtags')
    .insert({ product_id: productId, hashtag_id: hashtagId })
    .select()
    .single()

  if (error) {
    console.error('Error adding hashtag to product:', error)
    throw error
  }

  // Update usage count
  await updateHashtagUsageCount(hashtagId)

  return data
}

// Remove hashtag from product
export const removeHashtagFromProduct = async (productId: string, hashtagId: string) => {
  const { error } = await supabase
    .from('product_hashtags')
    .delete()
    .eq('product_id', productId)
    .eq('hashtag_id', hashtagId)

  if (error) {
    console.error('Error removing hashtag from product:', error)
    throw error
  }

  // Update usage count
  await updateHashtagUsageCount(hashtagId)
}

// Update hashtag usage count
export const updateHashtagUsageCount = async (hashtagId: string) => {
  // Count how many products use this hashtag
  const { count, error: countError } = await supabase
    .from('product_hashtags')
    .select('*', { count: 'exact' })
    .eq('hashtag_id', hashtagId)

  if (countError) {
    console.error('Error counting hashtag usage:', countError)
    return
  }

  // Update the usage count
  const { error: updateError } = await supabase
    .from('hashtags')
    .update({ usage_count: count || 0 })
    .eq('id', hashtagId)

  if (updateError) {
    console.error('Error updating hashtag usage count:', updateError)
  }
}

// Generate slug from name
export const generateHashtagSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^#/, '') // Remove leading # if present
}

// Check if hashtag slug exists
export const checkHashtagSlugExists = async (slug: string, excludeId?: string) => {
  let query = supabase
    .from('hashtags')
    .select('id')
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking hashtag slug existence:', error)
    return false
  }

  return data && data.length > 0
}

// Search products by hashtags
export const searchProductsByHashtags = async (hashtagSlugs: string[]) => {
  const { data, error } = await supabase
    .from('product_hashtags')
    .select(`
      products:product_id (
        *,
        brands:brand_id (name, slug, country),
        categories:category_id (name, slug),
        product_images (url, alt_text, position, is_primary)
      ),
      hashtags:hashtag_id!inner (slug)
    `)
    .in('hashtags.slug', hashtagSlugs)

  if (error) {
    console.error('Error searching products by hashtags:', error)
    return []
  }

  // Extract unique products
  const productMap = new Map()
  data?.forEach(item => {
    if (item.products && !productMap.has(item.products.id)) {
      productMap.set(item.products.id, item.products)
    }
  })

  return Array.from(productMap.values())
}