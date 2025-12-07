// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/search - Search products, brands, and categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'products', 'brands', 'categories', or 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const searchQuery = query.trim()
    const results: any = {}

    // Search products
    if (!type || type === 'products' || type === 'all') {
      const { data: products } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          currency,
          short_description,
          tags,
          brands:brand_id (name),
          product_images!inner (url, is_primary),
          product_hashtags (
            hashtags:hashtag_id (id, name, slug, color, is_active)
          )
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
        .limit(limit)

      results.products = products || []
    }

    // Search brands
    if (!type || type === 'brands' || type === 'all') {
      const { data: brands } = await supabase
        .from('brands')
        .select('id, name, slug, description, country')
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(limit)

      results.brands = brands || []
    }

    // Search categories
    if (!type || type === 'categories' || type === 'all') {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug, description, icon_name')
        .eq('is_active', true)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(limit)

      results.categories = categories || []
    }

    // Calculate total results
    const totalResults = Object.values(results).reduce(
      (sum: number, items: any) => sum + (items?.length || 0), 
      0
    )

    return NextResponse.json({
      query: searchQuery,
      totalResults,
      results
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}