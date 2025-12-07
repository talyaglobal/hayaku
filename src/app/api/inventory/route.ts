import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  const searchParams = request.nextUrl.searchParams
  const lowStock = searchParams.get('lowStock') === 'true'
  const productId = searchParams.get('productId')

  try {
    let query = supabase
      .from('inventory')
      .select(`
        *,
        products (
          id,
          name,
          sku,
          price
        )
      `)

    if (lowStock) {
      query = query.filter('quantity', 'lte', 'low_stock_threshold')
    }

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  
  try {
    const inventoryData = await request.json()
    
    const { data, error } = await supabase
      .from('inventory')
      .insert([inventoryData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}