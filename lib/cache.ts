import { unstable_cache } from 'next/cache'

// In-memory cache for development
const memoryCache = new Map<string, { value: any; expiry: number }>()

export const cache = {
  get: (key: string) => {
    const item = memoryCache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      memoryCache.delete(key)
      return null
    }
    
    return item.value
  },
  
  set: (key: string, value: any, ttlSeconds = 300) => {
    memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    })
  },
  
  delete: (key: string) => {
    memoryCache.delete(key)
  },
  
  clear: () => {
    memoryCache.clear()
  }
}

// Next.js cache wrapper
export const createCachedFunction = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  tags: string[] = [],
  revalidate: number = 3600
) => {
  return unstable_cache(fn, undefined, {
    tags,
    revalidate
  })
}

// Database query cache
export const cacheDatabase = {
  products: (id?: string) => createCachedFunction(
    async (productId: string) => {
      // Database query will be cached
      return productId
    },
    ['products', id || 'all'],
    1800 // 30 minutes
  ),
  
  categories: () => createCachedFunction(
    async () => {
      // Categories change less frequently
      return 'categories'
    },
    ['categories'],
    3600 // 1 hour
  ),
  
  user: (id: string) => createCachedFunction(
    async (userId: string) => {
      return userId
    },
    ['user', id],
    900 // 15 minutes
  )
}