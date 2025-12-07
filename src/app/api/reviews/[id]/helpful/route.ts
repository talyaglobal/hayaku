// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// POST /api/reviews/[id]/helpful - Mark a review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()
    const isHelpful = body.is_helpful !== false

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('review_votes')
      .select('id, is_helpful')
      .eq('review_id', params.id)
      .eq('user_id', authUser.user.id)
      .single()

    let voteAction = 'none'

    if (existingVote) {
      if (existingVote.is_helpful === isHelpful) {
        // Remove vote if clicking same button
        await supabase
          .from('review_votes')
          .delete()
          .eq('id', existingVote.id)
        voteAction = 'removed'
      } else {
        // Update vote
        await supabase
          .from('review_votes')
          .update({ is_helpful })
          .eq('id', existingVote.id)
        voteAction = 'updated'
      }
    } else {
      // Create new vote
      await supabase
        .from('review_votes')
        .insert([{
          review_id: params.id,
          user_id: authUser.user.id,
          is_helpful
        }])
      voteAction = 'created'
    }

    // Update helpful_count on review
    const { data: votes } = await supabase
      .from('review_votes')
      .select('id', { count: 'exact' })
      .eq('review_id', params.id)
      .eq('is_helpful', true)

    await supabase
      .from('product_reviews')
      .update({ helpful_count: votes?.length || 0 })
      .eq('id', params.id)

    return NextResponse.json({ 
      message: 'Vote recorded',
      action: voteAction,
      helpful_count: votes?.length || 0
    })

  } catch (error) {
    console.error('Vote on review error:', error)
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
