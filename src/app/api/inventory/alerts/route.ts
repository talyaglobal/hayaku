// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getAuthUser, handleAuthError } from '@/lib/auth-server'
import { sendLowStockAlertEmail } from '@/lib/email'

// GET /api/inventory/alerts - Get low stock alerts (Admin only)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return handleAuthError()
    }

    // Check if user is admin
    const supabase = await createClient()
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_active')
      .eq('id', authUser.user.id)
      .eq('is_active', true)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const threshold = parseInt(searchParams.get('threshold') || '5')

    // Get all products with low stock
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products:product_id (
          id,
          name,
          sku,
          is_active
        )
      `)
      .eq('track_inventory', true)
      .lte('quantity', supabase.raw('low_stock_threshold'))
      .gt('quantity', 0) // Not completely out of stock
      .order('quantity', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch low stock alerts' },
        { status: 500 }
      )
    }

    // Enrich with alert status
    const alerts = (data || []).map(item => ({
      ...item,
      stock_status: item.quantity === 0 ? 'out_of_stock' : 
                   item.quantity <= item.low_stock_threshold ? 'low_stock' : 'in_stock',
      percentage_remaining: item.low_stock_threshold > 0 
        ? Math.round((item.quantity / item.low_stock_threshold) * 100) 
        : 0
    }))

    return NextResponse.json({ 
      data: alerts,
      count: alerts.length
    })

  } catch (error) {
    console.error('Low stock alerts API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/alerts/check - Check and send low stock alerts (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)
    if (!authUser) {
      return handleAuthError()
    }

    // Check if user is admin
    const supabase = await createClient()
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_active, email')
      .eq('id', authUser.user.id)
      .eq('is_active', true)
      .single()

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Get all products with low stock
    const { data: lowStockItems, error } = await supabase
      .from('inventory')
      .select(`
        *,
        products:product_id (
          id,
          name,
          sku,
          is_active
        )
      `)
      .eq('track_inventory', true)
      .lte('quantity', supabase.raw('low_stock_threshold'))
      .gt('quantity', 0)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to check low stock items' },
        { status: 500 }
      )
    }

    // Send email alerts for low stock items
    const alertResults = []
    for (const item of lowStockItems || []) {
      if (item.products && item.products.is_active) {
        try {
          await sendLowStockAlertEmail({
            productName: item.products.name,
            productSku: item.products.sku || 'N/A',
            currentQuantity: item.quantity,
            threshold: item.low_stock_threshold,
            adminEmail: adminUser.email || process.env.ADMIN_EMAIL || 'admin@hayaku.com'
          })
          alertResults.push({ productId: item.product_id, status: 'sent' })
        } catch (emailError) {
          console.error(`Failed to send alert for product ${item.product_id}:`, emailError)
          alertResults.push({ productId: item.product_id, status: 'failed' })
        }
      }
    }

    return NextResponse.json({
      message: 'Low stock alerts checked',
      itemsChecked: lowStockItems?.length || 0,
      alertsSent: alertResults.filter(r => r.status === 'sent').length,
      results: alertResults
    })

  } catch (error) {
    console.error('Check low stock alerts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
