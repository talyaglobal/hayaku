// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const active = searchParams.get('active') !== 'false' // default to true
    const parent = searchParams.get('parent') // filter by parent category

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order, name')

    if (active) {
      query = query.eq('is_active', true)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (parent === 'null') {
      query = query.is('parent_id', null) // Get root categories
    } else if (parent) {
      query = query.eq('parent_id', parent)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description,
        parent_id: body.parent_id,
        image_url: body.image_url,
        icon_name: body.icon_name,
        is_featured: body.is_featured || false,
        is_active: body.is_active !== false,
        sort_order: body.sort_order || 0
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}