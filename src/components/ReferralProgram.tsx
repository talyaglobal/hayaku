'use client'

import { useState, useEffect } from 'react'
import { Gift, Users, TrendingUp, Copy, Check, Loader2, Share2 } from 'lucide-react'

interface ReferralStats {
  total_referrals: number
  completed_referrals: number
  pending_referrals: number
  total_earnings: number
}

interface ReferralCode {
  id: string
  code: string
  is_active: boolean
  total_uses: number
  total_referrals: number
  total_earnings: number
}

export default function ReferralProgram() {
  const [loading, setLoading] = useState(true)
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)
  const [referralLink, setReferralLink] = useState('')

  useEffect(() => {
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/referrals')
      const result = await response.json()

      if (response.ok) {
        setReferralCode(result.data.referral_code)
        setStats(result.data.stats)
        setReferralLink(`${window.location.origin}/auth/signup?ref=${result.data.referral_code.code}`)
      }
    } catch (error) {
      console.error('Error loading referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hayaku Referral',
          text: `Join Hayaku using my referral code: ${referralCode?.code}`,
          url: referralLink
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyToClipboard(referralLink)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
        <span className="ml-3 text-gray-600">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-luxury-serif text-luxury-charcoal">Referans Programı</h2>
      </div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-gold/5 p-6 rounded-lg border border-luxury-gold/20">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="h-6 w-6 text-luxury-gold" />
          <h3 className="text-xl font-medium text-luxury-charcoal">Referans Kodunuz</h3>
        </div>
        
        {referralCode && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-white border-2 border-luxury-gold rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Kodunuz</div>
                <div className="text-2xl font-bold text-luxury-charcoal font-mono">
                  {referralCode.code}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(referralCode.code)}
                className="flex items-center space-x-2 px-6 py-4 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Referans Linkiniz</div>
                <div className="text-sm text-gray-800 font-mono truncate">
                  {referralLink}
                </div>
              </div>
              <button
                onClick={shareReferral}
                className="flex items-center space-x-2 px-6 py-4 text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Paylaş</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-luxury-charcoal">
                  {stats.total_referrals}
                </div>
                <div className="text-sm text-gray-600">Toplam Referans</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {stats.pending_referrals} bekleyen
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="text-right">
                <div className="text-2xl font-bold text-luxury-charcoal">
                  {stats.completed_referrals}
                </div>
                <div className="text-sm text-gray-600">Tamamlanan</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              İlk alışveriş yapanlar
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <Gift className="h-8 w-8 text-luxury-gold" />
              <div className="text-right">
                <div className="text-2xl font-bold text-luxury-charcoal">
                  {stats.total_earnings.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Toplam Kazanç</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">TRY</div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-luxury-charcoal mb-4">Nasıl Çalışır?</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <p>Referans kodunuzu veya linkinizi arkadaşlarınızla paylaşın</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <p>Arkadaşınız kodunuzu kullanarak kayıt olsun</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-luxury-gold text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <p>Arkadaşınız ilk alışverişini yaptığında ikiniz de ödül kazanın!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
