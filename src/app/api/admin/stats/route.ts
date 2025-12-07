// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAdmin, handleAuthError } from '@/lib/auth-server'

// GET /api/admin/stats - Get dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(request)
    
    const supabase = await createClient()
    
    // Get product statistics
    const { data: productStats } = await supabase
      .from('products')
      .select('id, is_active, is_featured, price') as any

    // Get brand statistics  
    const { data: brandStats } = await supabase
      .from('brands')
      .select('id, is_active, is_featured') as any

    // Get category statistics
    const { data: categoryStats } = await supabase
      .from('categories')
      .select('id, is_active, is_featured') as any

    // Get user statistics
    const { data: userStats } = await supabase
      .from('user_profiles')
      .select('id, vip_tier, total_orders, total_spent, created_at') as any

    // Calculate statistics
    const stats = {
      products: {
        total: productStats?.length || 0,
        active: productStats?.filter(p => p.is_active).length || 0,
        featured: productStats?.filter(p => p.is_featured).length || 0,
        averagePrice: productStats?.length 
          ? Math.round(productStats.reduce((sum, p) => sum + (p.price || 0), 0) / productStats.length)
          : 0
      },
      brands: {
        total: brandStats?.length || 0,
        active: brandStats?.filter(b => b.is_active).length || 0,
        featured: brandStats?.filter(b => b.is_featured).length || 0
      },
      categories: {
        total: categoryStats?.length || 0,
        active: categoryStats?.filter(c => c.is_active).length || 0,
        featured: categoryStats?.filter(c => c.is_featured).length || 0
      },
      users: {
        total: userStats?.length || 0,
        bronze: userStats?.filter(u => u.vip_tier === 'Bronze').length || 0,
        gold: userStats?.filter(u => u.vip_tier === 'Gold').length || 0,
        platinum: userStats?.filter(u => u.vip_tier === 'Platinum').length || 0,
        diamond: userStats?.filter(u => u.vip_tier === 'Diamond').length || 0,
        totalRevenue: userStats?.reduce((sum, u) => sum + (u.total_spent || 0), 0) || 0,
        averageOrderValue: userStats?.length
          ? Math.round((userStats.reduce((sum, u) => sum + (u.total_spent || 0), 0)) / 
                     (userStats.reduce((sum, u) => sum + (u.total_orders || 0), 0) || 1))
          : 0
      }
    }

    return NextResponse.json({ data: stats })

  } catch (error) {
    console.error('Admin stats API error:', error)
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