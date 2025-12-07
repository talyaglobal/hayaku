'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultCount?: number
  filters?: any
}

const STORAGE_KEY = 'hayaku_search_history'
const MAX_HISTORY_ITEMS = 20

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSearchHistory(parsed || [])
      }
    } catch (error) {
      console.error('Error loading search history:', error)
      setSearchHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever history changes
  const saveToStorage = useCallback((history: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }, [])

  // Add a search to history
  const addToHistory = useCallback((query: string, resultCount?: number, filters?: any) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      query: trimmedQuery,
      timestamp: Date.now(),
      resultCount,
      filters,
    }

    setSearchHistory(prev => {
      // Remove existing entry with same query (case insensitive)
      const filtered = prev.filter(
        item => item.query.toLowerCase() !== trimmedQuery.toLowerCase()
      )
      
      // Add new item at the beginning
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  // Remove a specific search from history
  const removeFromHistory = useCallback((id: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(item => item.id !== id)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  // Clear all search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    saveToStorage([])
  }, [saveToStorage])

  // Get recent searches (just the query strings)
  const getRecentSearches = useCallback((limit: number = 5): string[] => {
    return searchHistory.slice(0, limit).map(item => item.query)
  }, [searchHistory])

  // Get popular searches based on frequency
  const getPopularSearches = useCallback((limit: number = 5): string[] => {
    const queryFrequency: Record<string, number> = {}
    
    searchHistory.forEach(item => {
      const query = item.query.toLowerCase()
      queryFrequency[query] = (queryFrequency[query] || 0) + 1
    })

    return Object.entries(queryFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query)
  }, [searchHistory])

  // Search through history
  const searchInHistory = useCallback((searchTerm: string): SearchHistoryItem[] => {
    if (!searchTerm.trim()) return []
    
    const term = searchTerm.toLowerCase()
    return searchHistory.filter(item =>
      item.query.toLowerCase().includes(term)
    )
  }, [searchHistory])

  // Get searches from a specific time period
  const getSearchesByDate = useCallback((daysBack: number = 7): SearchHistoryItem[] => {
    const cutoffTime = Date.now() - (daysBack * 24 * 60 * 60 * 1000)
    return searchHistory.filter(item => item.timestamp >= cutoffTime)
  }, [searchHistory])

  // Get search analytics
  const getSearchAnalytics = useCallback(() => {
    const totalSearches = searchHistory.length
    const uniqueQueries = new Set(searchHistory.map(item => item.query.toLowerCase())).size
    const averageResultCount = searchHistory
      .filter(item => item.resultCount !== undefined)
      .reduce((sum, item) => sum + (item.resultCount || 0), 0) / totalSearches

    // Get search frequency by day
    const searchesByDay: Record<string, number> = {}
    searchHistory.forEach(item => {
      const date = new Date(item.timestamp).toDateString()
      searchesByDay[date] = (searchesByDay[date] || 0) + 1
    })

    // Get most recent searches
    const recentSearches = searchHistory.slice(0, 10)

    return {
      totalSearches,
      uniqueQueries,
      averageResultCount: Math.round(averageResultCount) || 0,
      searchesByDay,
      recentSearches,
      popularQueries: getPopularSearches(10),
    }
  }, [searchHistory, getPopularSearches])

  return {
    searchHistory,
    isLoading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentSearches,
    getPopularSearches,
    searchInHistory,
    getSearchesByDate,
    getSearchAnalytics,
  }
}