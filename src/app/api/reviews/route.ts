// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/reviews?product_id=xxx - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = await createClient()

    let query = supabase
      .from('product_reviews')
      .select(`
        *,
        user_profiles!product_reviews_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    if (userId) {
      // Users can see their own unapproved reviews
      query = query.or(`user_id.eq.${userId},is_approved.eq.true`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })

  } catch (error) {
    console.error('Reviews API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    // Check if user already has a review for this product
    const { data: existingReview } = await supabase
      .from('product_reviews')
      .select('id')
      .eq('product_id', body.product_id)
      .eq('user_id', authUser.user.id)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if user has purchased this product (for verified purchase badge)
    let isVerifiedPurchase = false
    if (body.order_id) {
      const { data: orderItem } = await supabase
        .from('order_items')
        .select(`
          orders!inner (
            user_id,
            status
          )
        `)
        .eq('order_id', body.order_id)
        .eq('product_id', body.product_id)
        .single()

      if (orderItem && orderItem.orders?.user_id === authUser.user.id) {
        isVerifiedPurchase = true
      }
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .insert([{
        product_id: body.product_id,
        user_id: authUser.user.id,
        order_id: body.order_id || null,
        rating: body.rating,
        title: body.title || null,
        content: body.content || null,
        is_verified_purchase: isVerifiedPurchase,
        is_approved: false // Require moderation
      }])
      .select(`
        *,
        user_profiles!product_reviews_user_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create review error:', error)
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
