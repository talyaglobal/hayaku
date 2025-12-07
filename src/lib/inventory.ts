// @ts-nocheck
import { supabase } from './supabase'

export interface InventoryStatus {
  isAvailable: boolean
  isLowStock: boolean
  isOutOfStock: boolean
  availableQuantity: number
  allowPreOrder: boolean
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order'
}

/**
 * Get inventory status for a product
 */
export async function getInventoryStatus(productId: string): Promise<InventoryStatus> {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('quantity, low_stock_threshold, track_inventory, allow_backorder')
      .eq('product_id', productId)
      .single()

    if (error || !data) {
      // No inventory record, assume available if tracking is disabled
      return {
        isAvailable: true,
        isLowStock: false,
        isOutOfStock: false,
        availableQuantity: 0,
        allowPreOrder: false,
        stockStatus: 'in_stock'
      }
    }

    const quantity = data.quantity || 0
    const threshold = data.low_stock_threshold || 5
    const trackInventory = data.track_inventory !== false
    const allowBackorder = data.allow_backorder || false

    if (!trackInventory) {
      return {
        isAvailable: true,
        isLowStock: false,
        isOutOfStock: false,
        availableQuantity: Infinity,
        allowPreOrder: false,
        stockStatus: 'in_stock'
      }
    }

    const isOutOfStock = quantity === 0 && !allowBackorder
    const isLowStock = quantity > 0 && quantity <= threshold
    const isAvailable = quantity > 0 || allowBackorder

    let stockStatus: InventoryStatus['stockStatus'] = 'in_stock'
    if (isOutOfStock) {
      stockStatus = 'out_of_stock'
    } else if (quantity === 0 && allowBackorder) {
      stockStatus = 'pre_order'
    } else if (isLowStock) {
      stockStatus = 'low_stock'
    }

    return {
      isAvailable,
      isLowStock,
      isOutOfStock,
      availableQuantity: quantity,
      allowPreOrder: allowBackorder && quantity === 0,
      stockStatus
    }
  } catch (error) {
    console.error('Error getting inventory status:', error)
    return {
      isAvailable: true,
      isLowStock: false,
      isOutOfStock: false,
      availableQuantity: 0,
      allowPreOrder: false,
      stockStatus: 'in_stock'
    }
  }
}

/**
 * Check if quantity can be added to cart
 */
export async function canAddToCart(productId: string, requestedQuantity: number): Promise<{
  canAdd: boolean
  availableQuantity: number
  allowPreOrder: boolean
  message?: string
}> {
  try {
    const status = await getInventoryStatus(productId)

    if (!status.trackInventory) {
      return {
        canAdd: true,
        availableQuantity: Infinity,
        allowPreOrder: false
      }
    }

    if (status.isOutOfStock) {
      return {
        canAdd: false,
        availableQuantity: 0,
        allowPreOrder: false,
        message: 'Product is out of stock'
      }
    }

    if (status.availableQuantity > 0 && requestedQuantity > status.availableQuantity && !status.allowPreOrder) {
      return {
        canAdd: false,
        availableQuantity: status.availableQuantity,
        allowPreOrder: false,
        message: `Only ${status.availableQuantity} items available`
      }
    }

    if (status.availableQuantity === 0 && status.allowPreOrder) {
      return {
        canAdd: true,
        availableQuantity: 0,
        allowPreOrder: true,
        message: 'This item is available for pre-order'
      }
    }

    return {
      canAdd: true,
      availableQuantity: status.availableQuantity,
      allowPreOrder: status.allowPreOrder
    }
  } catch (error) {
    console.error('Error checking cart availability:', error)
    return {
      canAdd: true,
      availableQuantity: 0,
      allowPreOrder: false
    }
  }
}

/**
 * Subscribe to real-time inventory updates
 */
export function subscribeToInventoryUpdates(
  productId: string,
  callback: (status: InventoryStatus) => void
) {
  const channel = supabase
    .channel(`inventory:${productId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'inventory',
        filter: `product_id=eq.${productId}`
      },
      async () => {
        const status = await getInventoryStatus(productId)
        callback(status)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Subscribe to low stock alerts
 */
export function subscribeToLowStockAlerts(
  callback: (alerts: Array<{
    productId: string
    productName: string
    quantity: number
    threshold: number
  }>) => void
) {
  const channel = supabase
    .channel('low_stock_alerts')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'inventory',
        filter: 'quantity<=low_stock_threshold'
      },
      async (payload) => {
        // Fetch product details
        const { data: product } = await supabase
          .from('products')
          .select('id, name')
          .eq('id', payload.new.product_id)
          .single()

        if (product) {
          callback([{
            productId: product.id,
            productName: product.name,
            quantity: payload.new.quantity,
            threshold: payload.new.low_stock_threshold
          }])
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
