// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// PUT /api/reviews/[id] - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    // Verify the review belongs to the user
    const { data: existingReview } = await supabase
      .from('product_reviews')
      .select('user_id, is_approved')
      .eq('id', params.id)
      .single()

    if (!existingReview || existingReview.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Review not found or access denied' },
        { status: 404 }
      )
    }

    // If review is already approved, it needs to go back to moderation
    const updateData: any = {
      rating: body.rating,
      title: body.title || null,
      content: body.content || null,
      updated_at: new Date().toISOString()
    }

    // If review was approved and user is editing, require re-moderation
    if (existingReview.is_approved) {
      updateData.is_approved = false
    }

    const { data, error } = await supabase
      .from('product_reviews')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', authUser.user.id)
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
        { error: 'Failed to update review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('Update review error:', error)
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

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    // Verify the review belongs to the user
    const { data: existingReview } = await supabase
      .from('product_reviews')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (!existingReview || existingReview.user_id !== authUser.user.id) {
      return NextResponse.json(
        { error: 'Review not found or access denied' },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from('product_reviews')
      .delete()
      .eq('id', params.id)
      .eq('user_id', authUser.user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Review deleted successfully' })

  } catch (error) {
    console.error('Delete review error:', error)
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
