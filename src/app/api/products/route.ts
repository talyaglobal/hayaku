import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const search = searchParams.get('search') || ''
  const brandId = searchParams.get('brandId')
  const categoryId = searchParams.get('categoryId')
  
  let query = supabase
    .from('products')
    .select(`
      *,
      brands:brand_id(name, slug),
      categories:category_id(name, slug),
      product_images(url, alt_text, is_primary)
    `)
    .eq('is_active', true)

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (brandId) {
    query = query.eq('brand_id', brandId)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      hasNextPage: (page * limit) < (count || 0),
      hasPrevPage: page > 1
    }
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const product = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}