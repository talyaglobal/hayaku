import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  
  try {
    // Get products with low stock
    const { data: lowStockItems, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products (
          id,
          name,
          sku,
          price,
          brands (name)
        )
      `)
      .filter('track_inventory', 'eq', true)
      .filter('quantity', 'lte', 'low_stock_threshold')

    if (error) throw error

    // Get out of stock items
    const { data: outOfStockItems, error: outError } = await supabase
      .from('inventory')
      .select(`
        *,
        products (
          id,
          name,
          sku,
          price,
          brands (name)
        )
      `)
      .filter('track_inventory', 'eq', true)
      .eq('quantity', 0)

    if (outError) throw outError

    return NextResponse.json({
      data: {
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        alerts: {
          lowStockCount: lowStockItems?.length || 0,
          outOfStockCount: outOfStockItems?.length || 0,
          totalAlerts: (lowStockItems?.length || 0) + (outOfStockItems?.length || 0)
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}