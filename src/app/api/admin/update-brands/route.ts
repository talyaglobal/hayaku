import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Update brands data based on available brand images
    const brandsData: any[] = [
      { name: 'Adidas', slug: 'adidas', description: 'İkonik üç şeritli tasarımıyla tanınan dünya çapında spor giyim ve ayakkabı markası', country: 'Germany', is_featured: true, is_active: true },
      { name: 'Burberry', slug: 'burberry', description: 'Ikonik trench coat ve miras desenleriyle ünlü İngiliz lüks moda evi', country: 'United Kingdom', is_featured: true, is_active: true },
      { name: 'Calvin Klein', slug: 'calvin-klein', description: 'Minimalist tasarım ve modern Amerikan tarzıyla tanınan global moda markası', country: 'USA', is_featured: true, is_active: true },
      { name: 'Columbia', slug: 'columbia', description: 'Outdoor performans ve spor giyim alanında lider Amerikan markası', country: 'USA', is_featured: false, is_active: true },
      { name: 'Dolce & Gabbana', slug: 'dolce-gabbana', description: 'İtalyan kültürü ve işçiliğini kutlayan Sicilya lüks modası', country: 'Italy', is_featured: true, is_active: true },
      { name: 'Lacoste', slug: 'lacoste', description: 'Tenis geleneğinden doğan, timsah logolu ikonik Fransız spor şıklığı markası', country: 'France', is_featured: true, is_active: true },
      { name: 'Moncler', slug: 'moncler', description: 'Alp geleneğini çağdaş lüksle birleştiren premium dış giyim markası', country: 'France', is_featured: true, is_active: true },
      { name: 'Nike', slug: 'nike', description: 'Just Do It sloganı ve swoosh logosuyla tanınan dünya lideri spor markası', country: 'USA', is_featured: true, is_active: true },
      { name: 'Prada', slug: 'prada', description: 'Yenilikçi malzemeler ve ilerici tasarımlarıyla tanınan İtalyan lüks moda evi', country: 'Italy', is_featured: true, is_active: true },
      { name: 'Stone Island', slug: 'stone-island', description: 'Teknik inovasyon ve kumaş araştırmasıyla ünlü İtalyan spor giyim markası', country: 'Italy', is_featured: true, is_active: true },
      { name: 'Timberland', slug: 'timberland', description: 'Dayanıklı outdoor ayakkabı ve giyim ürünleriyle tanınan Amerikan markası', country: 'USA', is_featured: false, is_active: true },
      { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger', description: 'Preppy Amerikan tarzı ve kırmızı, beyaz, mavi renkleriyle ikonik moda markası', country: 'USA', is_featured: true, is_active: true }
    ]

    // First, remove old brands that don't have images
    await supabase
      .from('brands')
      .delete()
      .in('slug', ['bottega-veneta', 'off-white', 'maison-margiela'])

    // Insert/update brands with upsert
    const { data, error } = await (supabase as any)
      .from('brands')
      .upsert(brandsData, {
        onConflict: 'name'
      })

    if (error) {
      throw error
    }

    // Get count of active brands
    const { count } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return NextResponse.json({
      success: true,
      message: `Brands updated successfully! ${count} active brands now available.`,
      data
    })
  } catch (error: any) {
    console.error('Error updating brands:', error)
    return NextResponse.json(
      { error: 'Failed to update brands', details: error.message },
      { status: 500 }
    )
  }
}