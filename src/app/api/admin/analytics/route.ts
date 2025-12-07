// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/admin/analytics - Get analytics data (Admin only)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    
    const days = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Orders error:', ordersError)
    }

    // Get products data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, price, is_active, is_featured, created_at')

    if (productsError) {
      console.error('Products error:', productsError)
    }

    // Get users data
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, vip_tier, total_orders, total_spent, created_at')
      .gte('created_at', startDate.toISOString())

    if (usersError) {
      console.error('Users error:', usersError)
    }

    // Calculate revenue metrics
    const totalRevenue = orders?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0
    const todayRevenue = orders?.filter(order => {
      const orderDate = new Date(order.created_at)
      const today = new Date()
      return orderDate.toDateString() === today.toDateString()
    }).reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0

    // Calculate order metrics
    const totalOrders = orders?.length || 0
    const todayOrders = orders?.filter(order => {
      const orderDate = new Date(order.created_at)
      const today = new Date()
      return orderDate.toDateString() === today.toDateString()
    }).length || 0

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Order status breakdown
    const orderStatusBreakdown = orders?.reduce((acc: any, order) => {
      const status = order.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {}) || {}

    // Revenue by day (for chart)
    const revenueByDay = orders?.reduce((acc: any, order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + (parseFloat(order.total_amount) || 0)
      return acc
    }, {}) || {}

    // Top products (by order items - would need order_items join)
    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('product_id, quantity, price')
      .in('order_id', orders?.map(o => o.id) || [])

    const topProducts = orderItems?.reduce((acc: any, item) => {
      if (!item.product_id) return acc
      if (!acc[item.product_id]) {
        acc[item.product_id] = {
          product_id: item.product_id,
          quantity: 0,
          revenue: 0
        }
      }
      acc[item.product_id].quantity += item.quantity || 0
      acc[item.product_id].revenue += (parseFloat(item.price) || 0) * (item.quantity || 0)
      return acc
    }, {}) || {}

    const topProductsArray = Object.values(topProducts)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)

    // User metrics
    const newUsers = users?.length || 0
    const vipBreakdown = users?.reduce((acc: any, user) => {
      const tier = user.vip_tier || 'Bronze'
      acc[tier] = (acc[tier] || 0) + 1
      return acc
    }, {}) || {}

    // Product metrics
    const totalProducts = products?.length || 0
    const activeProducts = products?.filter(p => p.is_active).length || 0
    const featuredProducts = products?.filter(p => p.is_featured).length || 0

    const analytics = {
      revenue: {
        total: Math.round(totalRevenue),
        today: Math.round(todayRevenue),
        averageOrderValue: Math.round(averageOrderValue),
        byDay: revenueByDay
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        statusBreakdown: orderStatusBreakdown
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        featured: featuredProducts,
        topProducts: topProductsArray
      },
      users: {
        new: newUsers,
        vipBreakdown: vipBreakdown
      },
      period: days
    }

    return NextResponse.json({ data: analytics })

  } catch (error) {
    console.error('Admin analytics API error:', error)
    const authError = handleAuthError(error)
    if (authError.status !== 500) {
      return authError
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
