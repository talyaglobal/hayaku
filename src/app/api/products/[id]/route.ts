import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      brands:brand_id(name, slug, description),
      categories:category_id(name, slug, description),
      product_images(id, url, alt_text, position, is_primary),
      inventory(quantity, low_stock_threshold, track_inventory, allow_backorder)
    `)
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const updates = await request.json()
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}