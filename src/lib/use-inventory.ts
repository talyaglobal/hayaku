'use client'

import { useEffect, useState } from 'react'
import { subscribeToInventoryUpdates, getInventoryStatus, type InventoryStatus } from './inventory'

/**
 * React hook for real-time inventory status
 */
export function useInventory(productId: string | null) {
  const [status, setStatus] = useState<InventoryStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!productId) {
      setLoading(false)
      return
    }

    // Initial load
    getInventoryStatus(productId)
      .then(setStatus)
      .catch(setError)
      .finally(() => setLoading(false))

    // Subscribe to real-time updates
    const unsubscribe = subscribeToInventoryUpdates(productId, (newStatus) => {
      setStatus(newStatus)
    })

    return () => {
      unsubscribe()
    }
  }, [productId])

  return { status, loading, error }
}

/**
 * React hook for low stock alerts (admin only)
 */
export function useLowStockAlerts(enabled: boolean = false) {
  const [alerts, setAlerts] = useState<Array<{
    productId: string
    productName: string
    quantity: number
    threshold: number
  }>>([])

  useEffect(() => {
    if (!enabled) return

    const { subscribeToLowStockAlerts } = require('./inventory')
    const unsubscribe = subscribeToLowStockAlerts((newAlerts) => {
      setAlerts(prev => {
        // Merge alerts, avoiding duplicates
        const existingIds = new Set(prev.map(a => a.productId))
        const uniqueNewAlerts = newAlerts.filter(a => !existingIds.has(a.productId))
        return [...prev, ...uniqueNewAlerts]
      })
    })

    return () => {
      unsubscribe()
    }
  }, [enabled])

  return alerts
}
