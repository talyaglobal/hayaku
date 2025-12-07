// @ts-nocheck
import { supabase } from './supabase'

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  brand_id?: string
  category_id?: string
  sku?: string
  price: number
  compare_price?: number
  currency: string
  is_featured: boolean
  is_active: boolean
  tags?: string[]
  created_at: string
  updated_at: string
  brand?: {
    name: string
    slug: string
  }
  category?: {
    name: string
    slug: string
  }
  images?: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  position: number
  is_primary: boolean
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  country?: string
  is_featured: boolean
  is_active: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  is_featured: boolean
  is_active: boolean
}

// Get all products with brand and category info
export const getProducts = async (options?: {
  limit?: number
  offset?: number
  categoryId?: string
  brandId?: string
  featured?: boolean
  search?: string
}) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      brands:brand_id (name, slug, country),
      categories:category_id (name, slug),
      product_images (url, alt_text, position, is_primary),
      product_hashtags (
        hashtags:hashtag_id (id, name, slug, color, is_active)
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options?.brandId) {
    query = query.eq('brand_id', options.brandId)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,tags.cs.{${options.search}}`)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

// Get single product by slug
export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands:brand_id (name, slug, description),
      categories:category_id (name, slug, description),
      product_images (*),
      product_hashtags (
        hashtags:hashtag_id (id, name, slug, color, is_active)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

// Get single product by ID or slug
export const getProduct = async (identifier: string) => {
  // Check if identifier is a UUID (ID) or a slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier)
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands:brand_id (name, slug, description, country),
      categories:category_id (name, slug, description),
      product_images (*),
      product_hashtags (
        hashtags:hashtag_id (id, name, slug, color, is_active)
      )
    `)
    .eq(isUUID ? 'id' : 'slug', identifier)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  // Transform the data to include brand_name and category_name for compatibility
  if (data) {
    return {
      ...(data as any),
      brand_name: (data as any).brands?.name,
      category_name: (data as any).categories?.name,
    }
  }

  return data
}

// Get all brands
export const getBrands = async (activeOnly = true) => {
  let query = supabase
    .from('brands')
    .select('*')
    .order('name')

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }

  return data || []
}

// Get all categories
export const getCategories = async (activeOnly = true) => {
  let query = supabase
    .from('categories')
    .select('*')
    .order('name')

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Create a new product
export const createProduct = async (productData: {
  name: string
  slug: string
  description?: string
  short_description?: string
  brand_id?: string
  category_id?: string
  sku?: string
  price: number
  compare_price?: number
  currency?: string
  is_featured?: boolean
  tags?: string[]
}) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw error
  }

  return data
}

// Update product
export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData as any)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw error
  }

  return data
}

// Delete product
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Create brand
export const createBrand = async (brandData: {
  name: string
  slug: string
  description?: string
  country?: string
  is_featured?: boolean
}) => {
  const { data, error } = await supabase
    .from('brands')
    .insert(brandData as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating brand:', error)
    throw error
  }

  return data
}

// Create category
export const createCategory = async (categoryData: {
  name: string
  slug: string
  description?: string
  is_featured?: boolean
}) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw error
  }

  return data
}

// Generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}

// Check if slug exists
export const checkSlugExists = async (slug: string, table: 'products' | 'brands' | 'categories', excludeId?: string) => {
  let query = supabase
    .from(table)
    .select('id')
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error checking slug existence in ${table}:`, error)
    return false
  }

  return data && data.length > 0
}