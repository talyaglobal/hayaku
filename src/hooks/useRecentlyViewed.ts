'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'

export interface RecentlyViewedItem {
  id: string
  product: Product
  viewedAt: number
  viewCount: number
  sessionId?: string
}

const STORAGE_KEY = 'hayaku_recently_viewed'
const MAX_ITEMS = 50

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Generate session ID for tracking unique sessions
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('hayaku_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('hayaku_session_id', sessionId)
    }
    return sessionId
  }, [])

  // Load recently viewed items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Sort by viewedAt timestamp, most recent first
        const sorted = (parsed || []).sort((a: RecentlyViewedItem, b: RecentlyViewedItem) => 
          b.viewedAt - a.viewedAt
        )
        setRecentlyViewed(sorted)
      }
    } catch (error) {
      console.error('Error loading recently viewed products:', error)
      setRecentlyViewed([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever items change
  const saveToStorage = useCallback((items: RecentlyViewedItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error saving recently viewed products:', error)
    }
  }, [])

  // Add a product to recently viewed
  const addToRecentlyViewed = useCallback((product: Product) => {
    const sessionId = getSessionId()
    const now = Date.now()

    setRecentlyViewed(prev => {
      // Find existing item
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        // Update existing item - increase view count and update timestamp
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          viewedAt: now,
          viewCount: updated[existingIndex].viewCount + 1,
          sessionId,
        }
        
        // Move to front
        const [updatedItem] = updated.splice(existingIndex, 1)
        const newItems = [updatedItem, ...updated]
        
        saveToStorage(newItems)
        return newItems
      } else {
        // Add new item
        const newItem: RecentlyViewedItem = {
          id: `${product.id}_${now}`,
          product,
          viewedAt: now,
          viewCount: 1,
          sessionId,
        }
        
        const newItems = [newItem, ...prev].slice(0, MAX_ITEMS)
        saveToStorage(newItems)
        return newItems
      }
    })
  }, [saveToStorage, getSessionId])

  // Remove a product from recently viewed
  const removeFromRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.product.id !== productId)
      saveToStorage(filtered)
      return filtered
    })
  }, [saveToStorage])

  // Clear all recently viewed products
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
    saveToStorage([])
  }, [saveToStorage])

  // Get recently viewed products with optional limit
  const getRecentlyViewed = useCallback((limit?: number): Product[] => {
    const items = limit ? recentlyViewed.slice(0, limit) : recentlyViewed
    return items.map(item => item.product)
  }, [recentlyViewed])

  // Get recently viewed products by category
  const getRecentlyViewedByCategory = useCallback((categoryId: string, limit: number = 5): Product[] => {
    return recentlyViewed
      .filter(item => item.product.category_id === categoryId)
      .slice(0, limit)
      .map(item => item.product)
  }, [recentlyViewed])

  // Get recently viewed products by brand
  const getRecentlyViewedByBrand = useCallback((brandId: string, limit: number = 5): Product[] => {
    return recentlyViewed
      .filter(item => item.product.brand_id === brandId)
      .slice(0, limit)
      .map(item => item.product)
  }, [recentlyViewed])

  // Get viewing analytics
  const getViewingAnalytics = useCallback(() => {
    const totalViews = recentlyViewed.reduce((sum, item) => sum + item.viewCount, 0)
    const uniqueProducts = recentlyViewed.length
    const averageViews = uniqueProducts > 0 ? totalViews / uniqueProducts : 0

    // Most viewed product
    const mostViewed = recentlyViewed.reduce((max, item) => 
      item.viewCount > (max?.viewCount || 0) ? item : max, 
      null as RecentlyViewedItem | null
    )

    // Recent session activity (last hour)
    const recentActivity = recentlyViewed.filter(
      item => Date.now() - item.viewedAt < 60 * 60 * 1000
    )

    // Categories viewed
    const categoriesViewed = new Set(
      recentlyViewed
        .map(item => item.product.categories?.name)
        .filter(Boolean)
    ).size

    // Brands viewed
    const brandsViewed = new Set(
      recentlyViewed
        .map(item => item.product.brands?.name)
        .filter(Boolean)
    ).size

    // Get viewing patterns by time
    const viewingByHour: Record<number, number> = {}
    recentlyViewed.forEach(item => {
      const hour = new Date(item.viewedAt).getHours()
      viewingByHour[hour] = (viewingByHour[hour] || 0) + 1
    })

    const peakHour = Object.entries(viewingByHour)
      .reduce((max, [hour, count]) => 
        count > max.count ? { hour: parseInt(hour), count } : max,
        { hour: 0, count: 0 }
      )

    return {
      totalViews,
      uniqueProducts,
      averageViews: Math.round(averageViews * 10) / 10,
      mostViewed: mostViewed?.product || null,
      recentActivity: recentActivity.length,
      categoriesViewed,
      brandsViewed,
      peakHour: peakHour.count > 0 ? peakHour.hour : null,
      viewingByHour,
    }
  }, [recentlyViewed])

  // Check if a product was recently viewed
  const isRecentlyViewed = useCallback((productId: string): boolean => {
    return recentlyViewed.some(item => item.product.id === productId)
  }, [recentlyViewed])

  // Get products viewed in current session
  const getCurrentSessionViews = useCallback((): Product[] => {
    const currentSessionId = getSessionId()
    return recentlyViewed
      .filter(item => item.sessionId === currentSessionId)
      .map(item => item.product)
  }, [recentlyViewed, getSessionId])

  // Get products similar to recently viewed (based on category/brand)
  const getSimilarProducts = useCallback((allProducts: Product[], limit: number = 10): Product[] => {
    if (recentlyViewed.length === 0) return []

    // Get categories and brands from recently viewed
    const viewedCategories = new Set(
      recentlyViewed.map(item => item.product.category_id).filter(Boolean)
    )
    const viewedBrands = new Set(
      recentlyViewed.map(item => item.product.brand_id).filter(Boolean)
    )
    const viewedProductIds = new Set(
      recentlyViewed.map(item => item.product.id)
    )

    // Score products based on similarity
    const scoredProducts = allProducts
      .filter(product => !viewedProductIds.has(product.id)) // Exclude already viewed
      .map(product => {
        let score = 0
        
        // Category match
        if (product.category_id && viewedCategories.has(product.category_id)) {
          score += 3
        }
        
        // Brand match
        if (product.brand_id && viewedBrands.has(product.brand_id)) {
          score += 2
        }
        
        // Featured products get bonus
        if (product.is_featured) {
          score += 1
        }

        return { product, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product)

    return scoredProducts
  }, [recentlyViewed])

  return {
    recentlyViewed,
    isLoading,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    getRecentlyViewedByCategory,
    getRecentlyViewedByBrand,
    getViewingAnalytics,
    isRecentlyViewed,
    getCurrentSessionViews,
    getSimilarProducts,
  }
}