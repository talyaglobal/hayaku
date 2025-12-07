// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const featured = searchParams.get('featured') === 'true'
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Calculate offset
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        brands:brand_id (name, slug, country),
        categories:category_id (name, slug),
        product_images (url, alt_text, position, is_primary),
        product_hashtags (
          hashtags:hashtag_id (id, name, slug, color, is_active)
        )
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    if (category) {
      query = query.eq('categories.slug', category)
    }

    if (brand) {
      query = query.eq('brands.slug', brand)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description,
        brand_id: body.brand_id,
        category_id: body.category_id,
        sku: body.sku,
        price: body.price,
        compare_price: body.compare_price,
        currency: body.currency || 'TRY',
        is_featured: body.is_featured || false,
        is_active: body.is_active !== false,
        tags: body.tags || []
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}