// Types for the Hayaku e-commerce platform

export interface CartItem {
  id: string
  productId?: string
  name: string
  price: number
  quantity: number
  image: string
  brand: string
  size: string
  color: string
  inStock: boolean
}

export interface FilterState {
  brands: string[]
  categories: string[]
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isLimitedEdition: boolean
}

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
  brands?: {
    name: string
    slug: string
  }
  categories?: {
    name: string
    slug: string
  }
  product_images?: ProductImage[]
  inventory?: Inventory[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text?: string
  position: number
  is_primary: boolean
  created_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  country?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: string
  product_id: string
  quantity: number
  low_stock_threshold: number
  track_inventory: boolean
  allow_backorder: boolean
  updated_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  phone?: string
  birth_date?: string
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  vip_tier: 'Bronze' | 'Gold' | 'Platinum' | 'Diamond'
  vip_points: number
  total_orders: number
  total_spent: number
  preferred_language: 'en' | 'fr-CA'
  preferred_currency: 'TRY' | 'USD' | 'EUR'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserAddress {
  id: string
  user_id: string
  title: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  is_billing_address: boolean
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  wishlist_id: string
  product_id: string
  added_at: string
  products: Product
}

export interface Order {
  id: string
  user_id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total_amount: number
  currency: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  shipping_address?: any
  billing_address?: any
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_sku?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface SearchResults {
  query: string
  totalResults: number
  results: {
    products: Product[]
    brands: Brand[]
    categories: Category[]
  }
}