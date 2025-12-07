// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/brands - Get all brands
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const active = searchParams.get('active') !== 'false' // default to true

    let query = supabase
      .from('brands')
      .select('*')
      .order('name')

    if (active) {
      query = query.eq('is_active', true)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch brands' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Brands API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/brands - Create new brand (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('brands')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description,
        logo_url: body.logo_url,
        banner_url: body.banner_url,
        country: body.country,
        website_url: body.website_url,
        is_featured: body.is_featured || false,
        is_active: body.is_active !== false,
        sort_order: body.sort_order || 0
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create brand' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create brand error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}