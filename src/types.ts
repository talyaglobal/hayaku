export interface Product {
  id: string
  name: string
  slug?: string
  price: number
  currency?: string
  compare_price?: number
  description?: string
  brand_id?: string
  category_id?: string
  brands?: { name: string; slug?: string }
  categories?: { name: string; slug?: string }
  product_images?: Array<{ id?: string; url: string; alt_text?: string; product_id?: string; position?: number; is_primary?: boolean; created_at?: string }>
  is_featured?: boolean
  is_active?: boolean
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  is_featured?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  is_featured?: boolean
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
  size?: string
  color?: string
}

export interface Order {
  id: string
  order_number?: string
  status: string
  payment_status?: string
  total: number
  currency?: string
  created_at?: string
  items: OrderItem[]
  subtotal?: number
  tax_amount?: number
  shipping_amount?: number
  discount_amount?: number
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product_name?: string
  product_sku?: string
  total_price?: number
  unit_price?: number
}

export interface FilterState {
  priceRange?: number[] | { min: number; max: number }
  brands?: string[]
  categories?: string[]
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  inStock?: boolean
  isNew?: boolean
  isLimitedEdition?: boolean
  sortBy?: string
}

export interface SearchResults {
  query?: string
  totalResults?: number
  products: Product[]
  total: number
  page: number
  hasMore: boolean
  results?: { 
    products: Product[]; 
    total: number; 
    page: number; 
    hasMore: boolean;
    brands?: Array<{ id: string; name: string; slug: string }>;
    categories?: Array<{ id: string; name: string; slug: string }>;
  }
}