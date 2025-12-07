'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '@/types'
import { useRecentlyViewed } from './useRecentlyViewed'

export interface RecommendationEngine {
  type: 'trending' | 'similar' | 'collaborative' | 'content_based' | 'featured' | 'new_arrivals'
  weight: number
  enabled: boolean
}

export interface ProductRecommendation {
  product: Product
  score: number
  reasons: string[]
  engine: RecommendationEngine['type']
}

export interface RecommendationOptions {
  limit?: number
  excludeViewed?: boolean
  categories?: string[]
  brands?: string[]
  priceRange?: [number, number]
  engines?: RecommendationEngine['type'][]
}

const DEFAULT_ENGINES: RecommendationEngine[] = [
  { type: 'trending', weight: 0.3, enabled: true },
  { type: 'similar', weight: 0.25, enabled: true },
  { type: 'collaborative', weight: 0.2, enabled: true },
  { type: 'content_based', weight: 0.15, enabled: true },
  { type: 'featured', weight: 0.05, enabled: true },
  { type: 'new_arrivals', weight: 0.05, enabled: true },
]

export function useRecommendations(allProducts: Product[] = []) {
  const [isLoading, setIsLoading] = useState(false)
  const [engines, setEngines] = useState<RecommendationEngine[]>(DEFAULT_ENGINES)
  const { getRecentlyViewed, getViewingAnalytics } = useRecentlyViewed()

  // Get user preferences based on viewing history
  const userPreferences = useMemo(() => {
    const recentlyViewed = getRecentlyViewed()
    const analytics = getViewingAnalytics()
    
    const categories = new Set<string>()
    const brands = new Set<string>()
    const priceRange = { min: Infinity, max: 0 }
    const tags = new Set<string>()

    recentlyViewed.forEach(product => {
      if (product.category_id) categories.add(product.category_id)
      if (product.brand_id) brands.add(product.brand_id)
      if (product.price < priceRange.min) priceRange.min = product.price
      if (product.price > priceRange.max) priceRange.max = product.price
      product.tags?.forEach(tag => tags.add(tag))
    })

    return {
      categories: Array.from(categories),
      brands: Array.from(brands),
      priceRange: priceRange.min === Infinity ? [0, 10000] as [number, number] : [priceRange.min * 0.7, priceRange.max * 1.3] as [number, number],
      tags: Array.from(tags),
      viewCount: recentlyViewed.length,
      mostViewedProduct: analytics.mostViewed,
    }
  }, [getRecentlyViewed, getViewingAnalytics])

  // Trending products engine
  const getTrendingRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    // Mock trending algorithm - in real app, this would come from analytics
    const mockTrendingScores: Record<string, number> = {}
    allProducts.forEach(product => {
      // Simulate trending scores based on various factors
      let score = Math.random() * 100
      
      // Featured products get higher trending scores
      if (product.is_featured) score *= 1.5
      
      // Products with discounts trend higher
      if (product.compare_price && product.compare_price > product.price) score *= 1.3
      
      // Newer products trend higher
      const daysSinceCreated = product.created_at ? (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24) : 365
      if (daysSinceCreated < 30) score *= 1.2
      
      mockTrendingScores[product.id] = score
    })

    return allProducts
      .filter(product => product.is_active)
      .map(product => ({
        product,
        score: mockTrendingScores[product.id] || 0,
        reasons: ['Currently trending', 'Popular with other customers'],
        engine: 'trending' as const,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10)
  }, [allProducts])

  // Similar products engine (based on recently viewed)
  const getSimilarRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    const recentlyViewed = getRecentlyViewed(5) // Last 5 viewed products
    
    if (recentlyViewed.length === 0) return []

    const recommendations: ProductRecommendation[] = []
    
    allProducts.forEach(product => {
      if (options.excludeViewed && recentlyViewed.find(viewed => viewed.id === product.id)) {
        return
      }
      
      let score = 0
      const reasons: string[] = []

      recentlyViewed.forEach(viewedProduct => {
        // Same category
        if (product.category_id === viewedProduct.category_id) {
          score += 30
          reasons.push(`Similar to ${viewedProduct.name}`)
        }
        
        // Same brand
        if (product.brand_id === viewedProduct.brand_id) {
          score += 20
          reasons.push(`From ${viewedProduct.brands?.name}`)
        }
        
        // Similar price range (±30%)
        const priceDiff = Math.abs(product.price - viewedProduct.price) / viewedProduct.price
        if (priceDiff <= 0.3) {
          score += 10
          reasons.push('Similar price range')
        }
        
        // Common tags
        const commonTags = (product.tags || []).filter(tag => 
          (viewedProduct.tags || []).includes(tag)
        ).length
        score += commonTags * 5
        if (commonTags > 0) {
          reasons.push(`${commonTags} common features`)
        }
      })

      if (score > 0) {
        recommendations.push({
          product,
          score,
          reasons: Array.from(new Set(reasons)),
          engine: 'similar',
        })
      }
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10)
  }, [allProducts, getRecentlyViewed])

  // Collaborative filtering engine (users who viewed X also viewed Y)
  const getCollaborativeRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    // Mock collaborative filtering - in real app, this would use user behavior data
    const recentlyViewed = getRecentlyViewed(3)
    
    if (recentlyViewed.length === 0) return []

    const mockCollaborativeData: Record<string, string[]> = {}
    
    // Simulate collaborative data
    allProducts.forEach(product => {
      const relatedProducts = allProducts
        .filter(p => p.id !== product.id)
        .filter(p => 
          p.category_id === product.category_id || 
          p.brand_id === product.brand_id
        )
        .map(p => p.id)
        .slice(0, 3)
      
      mockCollaborativeData[product.id] = relatedProducts
    })

    const recommendations: ProductRecommendation[] = []
    const scoredProducts: Record<string, number> = {}

    recentlyViewed.forEach(viewedProduct => {
      const relatedIds = mockCollaborativeData[viewedProduct.id] || []
      
      relatedIds.forEach(id => {
        scoredProducts[id] = (scoredProducts[id] || 0) + 25
      })
    })

    Object.entries(scoredProducts).forEach(([productId, score]) => {
      const product = allProducts.find(p => p.id === productId)
      if (product && product.is_active) {
        recommendations.push({
          product,
          score,
          reasons: ['Customers who viewed similar items also liked this'],
          engine: 'collaborative',
        })
      }
    })

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10)
  }, [allProducts, getRecentlyViewed])

  // Content-based filtering (based on product attributes)
  const getContentBasedRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    const { categories, brands, tags, priceRange } = userPreferences
    
    if (categories.length === 0 && brands.length === 0) return []

    return allProducts
      .filter(product => product.is_active)
      .map(product => {
        let score = 0
        const reasons: string[] = []

        // Category preference
        if (categories.includes(product.category_id || '')) {
          score += 20
          reasons.push('Matches your interests')
        }

        // Brand preference
        if (brands.includes(product.brand_id || '')) {
          score += 15
          reasons.push('From a brand you like')
        }

        // Price preference
        if (product.price >= priceRange[0] && product.price <= priceRange[1]) {
          score += 10
          reasons.push('In your price range')
        }

        // Tag matching
        const tagMatches = (product.tags || []).filter(tag => tags.includes(tag)).length
        score += tagMatches * 3
        if (tagMatches > 0) {
          reasons.push(`${tagMatches} matching preferences`)
        }

        return {
          product,
          score,
          reasons,
          engine: 'content_based' as const,
        }
      })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10)
  }, [allProducts, userPreferences])

  // Featured products engine
  const getFeaturedRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    return allProducts
      .filter(product => product.is_featured && product.is_active)
      .map(product => ({
        product,
        score: 50,
        reasons: ['Featured product', 'Staff pick'],
        engine: 'featured' as const,
      }))
      .slice(0, options.limit || 5)
  }, [allProducts])

  // New arrivals engine
  const getNewArrivalsRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return allProducts
      .filter(product => 
        product.is_active && 
        product.created_at && new Date(product.created_at) >= thirtyDaysAgo
      )
      .map(product => ({
        product,
        score: 40,
        reasons: ['New arrival', 'Latest collection'],
        engine: 'new_arrivals' as const,
      }))
      .sort((a, b) => {
        const dateA = a.product.created_at ? new Date(a.product.created_at).getTime() : 0
        const dateB = b.product.created_at ? new Date(b.product.created_at).getTime() : 0
        return dateB - dateA
      })
      .slice(0, options.limit || 5)
  }, [allProducts])

  // Main recommendation function that combines all engines
  const getRecommendations = useCallback(async (options: RecommendationOptions = {}): Promise<ProductRecommendation[]> => {
    setIsLoading(true)
    
    try {
      const enabledEngines = engines.filter(engine => 
        engine.enabled && 
        (!options.engines || options.engines.includes(engine.type))
      )

      const allRecommendations: ProductRecommendation[] = []

      // Get recommendations from each engine
      for (const engine of enabledEngines) {
        let engineRecommendations: ProductRecommendation[] = []
        
        try {
          switch (engine.type) {
            case 'trending':
              engineRecommendations = await getTrendingRecommendations(options)
              break
            case 'similar':
              engineRecommendations = await getSimilarRecommendations(options)
              break
            case 'collaborative':
              engineRecommendations = await getCollaborativeRecommendations(options)
              break
            case 'content_based':
              engineRecommendations = await getContentBasedRecommendations(options)
              break
            case 'featured':
              engineRecommendations = await getFeaturedRecommendations(options)
              break
            case 'new_arrivals':
              engineRecommendations = await getNewArrivalsRecommendations(options)
              break
          }

          // Apply engine weight to scores
          engineRecommendations = engineRecommendations.map(rec => ({
            ...rec,
            score: rec.score * engine.weight,
          }))

          allRecommendations.push(...engineRecommendations)
        } catch (error) {
          console.error(`Error in ${engine.type} engine:`, error)
        }
      }

      // Combine and deduplicate recommendations
      const productScores: Record<string, ProductRecommendation> = {}
      
      allRecommendations.forEach(rec => {
        if (productScores[rec.product.id]) {
          // Combine scores and reasons
          productScores[rec.product.id].score += rec.score
          productScores[rec.product.id].reasons.push(...rec.reasons)
          productScores[rec.product.id].reasons = Array.from(new Set(productScores[rec.product.id].reasons))
        } else {
          productScores[rec.product.id] = { ...rec }
        }
      })

      // Apply filters
      let filteredRecommendations = Object.values(productScores)

      if (options.categories?.length) {
        filteredRecommendations = filteredRecommendations.filter(rec =>
          options.categories!.includes(rec.product.category_id || '')
        )
      }

      if (options.brands?.length) {
        filteredRecommendations = filteredRecommendations.filter(rec =>
          options.brands!.includes(rec.product.brand_id || '')
        )
      }

      if (options.priceRange) {
        filteredRecommendations = filteredRecommendations.filter(rec =>
          rec.product.price >= options.priceRange![0] && 
          rec.product.price <= options.priceRange![1]
        )
      }

      if (options.excludeViewed) {
        const viewedIds = new Set(getRecentlyViewed().map(p => p.id))
        filteredRecommendations = filteredRecommendations.filter(rec =>
          !viewedIds.has(rec.product.id)
        )
      }

      // Sort by score and limit results
      return filteredRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, options.limit || 20)

    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [
    engines,
    getTrendingRecommendations,
    getSimilarRecommendations,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getFeaturedRecommendations,
    getNewArrivalsRecommendations,
    getRecentlyViewed,
  ])

  // Get personalized recommendations
  const getPersonalizedRecommendations = useCallback(async (limit: number = 10): Promise<ProductRecommendation[]> => {
    return getRecommendations({
      limit,
      excludeViewed: true,
      engines: userPreferences.viewCount > 0 
        ? ['similar', 'content_based', 'collaborative', 'trending']
        : ['featured', 'trending', 'new_arrivals'],
    })
  }, [getRecommendations, userPreferences])

  // Configure recommendation engines
  const updateEngine = useCallback((type: RecommendationEngine['type'], updates: Partial<RecommendationEngine>) => {
    setEngines(prev => prev.map(engine => 
      engine.type === type ? { ...engine, ...updates } : engine
    ))
  }, [])

  return {
    getRecommendations,
    getPersonalizedRecommendations,
    getTrendingRecommendations,
    getSimilarRecommendations,
    getCollaborativeRecommendations,
    getContentBasedRecommendations,
    getFeaturedRecommendations,
    getNewArrivalsRecommendations,
    engines,
    updateEngine,
    userPreferences,
    isLoading,
  }
}