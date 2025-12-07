// Database optimization utilities and query builders
import { cache, createCachedFunction } from './cache'

// Optimized query patterns
export const optimizedQueries = {
  // Product queries with proper indexing hints
  getProductById: createCachedFunction(
    async (id: string) => {
      // Use indexed columns and avoid SELECT *
      const query = `
        SELECT p.id, p.name, p.price, p.sale_price, p.description, p.category_id, p.brand_id,
               c.name as category_name, b.name as brand_name
        FROM products p
        JOIN categories c ON p.category_id = c.id  
        JOIN brands b ON p.brand_id = b.id
        WHERE p.id = $1 AND p.is_active = true
      `
      // Actual database call would go here
      return { id, query }
    },
    ['product'],
    1800
  ),

  // Paginated products with efficient counting
  getProductsPaginated: createCachedFunction(
    async (page: number, limit: number, filters?: any) => {
      // Use window functions for efficient pagination
      const query = `
        WITH product_data AS (
          SELECT p.*, 
                 ROW_NUMBER() OVER (ORDER BY p.created_at DESC) as rn,
                 COUNT(*) OVER () as total_count
          FROM products p
          WHERE p.is_active = true
          ${filters ? 'AND category_id = ANY($3)' : ''}
        )
        SELECT * FROM product_data 
        WHERE rn BETWEEN $1 AND $2
      `
      return { page, limit, query }
    },
    ['products', 'paginated'],
    900
  ),

  // Optimized search with full-text search
  searchProducts: async (searchTerm: string, limit = 20) => {
    const cacheKey = `search:${searchTerm}:${limit}`
    const cached = cache.get(cacheKey)
    if (cached) return cached

    // Use GIN index for full-text search
    const query = `
      SELECT p.id, p.name, p.price, p.sale_price,
             ts_rank(p.search_vector, plainto_tsquery($1)) as rank
      FROM products p
      WHERE p.search_vector @@ plainto_tsquery($1)
         AND p.is_active = true
      ORDER BY rank DESC, p.created_at DESC
      LIMIT $2
    `
    
    const result = { searchTerm, limit, query }
    cache.set(cacheKey, result, 600) // 10 minutes
    return result
  }
}

// Database index suggestions
export const indexOptimizations = `
-- Essential indexes for performance

-- Products table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active_created 
  ON products (is_active, created_at DESC) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category_active 
  ON products (category_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_brand_active 
  ON products (brand_id, is_active) WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price 
  ON products (price) WHERE is_active = true;

-- Full-text search index
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search 
  ON products USING gin(search_vector);

-- User profiles indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_vip_tier 
  ON user_profiles (vip_tier);

-- Orders indexes  
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_user_status 
  ON orders (user_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created 
  ON orders (created_at DESC);

-- Cart items indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cart_items_user 
  ON cart_items (user_id) WHERE is_active = true;

-- Wishlist indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wishlist_user_product 
  ON wishlist_items (user_id, product_id);

-- Reviews indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_product_active 
  ON reviews (product_id, is_active) WHERE is_active = true;

-- Analytics indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_date 
  ON analytics_events (created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type_date 
  ON analytics_events (event_type, created_at DESC);
`

// Query performance monitoring
export const queryMonitor = {
  logSlowQuery: (query: string, duration: number, threshold = 1000) => {
    if (duration > threshold) {
      console.warn(`Slow query detected (${duration}ms):`, query.substring(0, 100))
    }
  },

  explainQuery: async (query: string) => {
    // In production, this would run EXPLAIN ANALYZE
    return `EXPLAIN (ANALYZE, BUFFERS) ${query}`
  }
}

// Connection pooling configuration
export const connectionConfig = {
  // For Supabase or direct PostgreSQL connections
  pool: {
    min: 2,
    max: 20,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  }
}