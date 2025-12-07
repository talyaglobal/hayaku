// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { requireAuth, handleAuthError } from '@/lib/auth-server'

// GET /api/referrals - Get user's referral code and stats
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const supabase = await createClient()

    // Get or create referral code
    let { data: referralCode } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', authUser.user.id)
      .single()

    // If no referral code exists, create one
    if (!referralCode) {
      // Generate a unique code
      const code = `${authUser.user.email?.split('@')[0].toUpperCase() || 'REF'}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      
      const { data: newCode, error: createError } = await supabase
        .from('referral_codes')
        .insert([{
          user_id: authUser.user.id,
          code: code
        }])
        .select()
        .single()

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create referral code' },
          { status: 500 }
        )
      }
      referralCode = newCode
    }

    // Get referral stats
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', authUser.user.id)

    const stats = {
      total_referrals: referrals?.length || 0,
      completed_referrals: referrals?.filter(r => r.referral_status === 'completed').length || 0,
      pending_referrals: referrals?.filter(r => r.referral_status === 'pending').length || 0,
      total_earnings: referralCode.total_earnings || 0
    }

    return NextResponse.json({
      data: {
        referral_code: referralCode,
        stats,
        referrals: referrals || []
      }
    })

  } catch (error) {
    console.error('Referrals API error:', error)
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

// POST /api/referrals - Create a referral (when someone uses a code)
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const supabase = await createClient()

    const { code, email } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      )
    }

    // Find the referral code
    const { data: referralCode } = await supabase
      .from('referral_codes')
      .select('*, user_profiles!referral_codes_user_id_fkey(*)')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      )
    }

    // Don't allow self-referral
    if (referralCode.user_id === authUser.user.id) {
      return NextResponse.json(
        { error: 'You cannot use your own referral code' },
        { status: 400 }
      )
    }

    // Check if user was already referred
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', authUser.user.id)
      .single()

    if (existingReferral) {
      return NextResponse.json(
        { error: 'You have already been referred' },
        { status: 400 }
      )
    }

    // Create referral record
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert([{
        referral_code_id: referralCode.id,
        referrer_id: referralCode.user_id,
        referred_user_id: authUser.user.id,
        referral_email: email || authUser.user.email,
        referral_status: 'signed_up',
        signup_date: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create referral' },
        { status: 500 }
      )
    }

    // Update referral code stats
    await supabase
      .from('referral_codes')
      .update({
        total_uses: (referralCode.total_uses || 0) + 1,
        total_referrals: (referralCode.total_referrals || 0) + 1
      })
      .eq('id', referralCode.id)

    return NextResponse.json({ data: referral }, { status: 201 })

  } catch (error) {
    console.error('Create referral error:', error)
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
