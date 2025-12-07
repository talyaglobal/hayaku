'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Package, Heart, Settings, CreditCard, MapPin, Save, Edit2, Bell, Crown, Award, Star, Diamond, Loader2 } from 'lucide-react'
import { getUserProfile, upsertUserProfile, getUserNotificationPreferences, updateNotificationPreferences } from '@/lib/supabase'
import { getCurrentSession, signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const router = useRouter()
  
  // Load user data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Get current session
      const session = await getCurrentSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }
      
      setAuthUser(session.user)
      
      // Get user profile
      const profile = await getUserProfile(session.user.id)
      
      // Get notification preferences
      const notifications = await getUserNotificationPreferences(session.user.id)
      
      if (profile) {
        setUser({
          id: (profile as any).id,
          name: (profile as any).full_name,
          email: session.user.email,
          phone: (profile as any).phone || '',
          birthDate: (profile as any).birth_date || '',
          gender: (profile as any).gender || 'male',
          vipTier: (profile as any).vip_tier,
          points: (profile as any).vip_points,
          nextTierPoints: getNextTierPoints((profile as any).vip_tier),
          orders: (profile as any).total_orders,
          wishlist: 0, // Will be loaded from wishlist table
          notifications: {
            email: notifications?.email_notifications ?? true,
            sms: notifications?.sms_notifications ?? true,
            push: notifications?.push_notifications ?? false
          },
          preferences: {
            language: (profile as any).preferred_language,
            currency: (profile as any).preferred_currency,
            newsletter: notifications?.newsletter_subscription ?? true
          }
        })
      } else {
        // Create default profile if none exists
        const newProfile = await upsertUserProfile({
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          preferred_language: 'en',
          preferred_currency: 'TRY'
        })
        
        if (newProfile) {
          setUser({
            id: (newProfile as any).id,
            name: (newProfile as any).full_name,
            email: session.user.email,
            phone: '',
            birthDate: '',
            gender: 'male',
            vipTier: (newProfile as any).vip_tier,
            points: (newProfile as any).vip_points,
            nextTierPoints: getNextTierPoints((newProfile as any).vip_tier),
            orders: (newProfile as any).total_orders,
            wishlist: 0,
            notifications: {
              email: true,
              sms: true,
              push: false
            },
            preferences: {
              language: (newProfile as any).preferred_language,
              currency: (newProfile as any).preferred_currency,
              newsletter: true
            }
          })
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNextTierPoints = (tier: string) => {
    switch(tier) {
      case 'Bronze': return 1000
      case 'Gold': return 2500
      case 'Platinum': return 5000
      case 'Diamond': return 10000
      default: return 1000
    }
  }

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'Bronze': return <Award className="h-5 w-5 text-amber-700" />
      case 'Gold': return <Star className="h-5 w-5 text-yellow-500" />
      case 'Platinum': return <Crown className="h-5 w-5 text-purple-500" />
      case 'Diamond': return <Diamond className="h-5 w-5 text-blue-500" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Bronze': return 'text-amber-700 bg-amber-50 border-amber-200'
      case 'Gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'Platinum': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'Diamond': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleSave = async () => {
    if (!user || !authUser) return
    
    try {
      setSaving(true)
      
      // Update profile
      await upsertUserProfile({
        id: user.id,
        full_name: user.name,
        phone: user.phone || null,
        birth_date: user.birthDate || null,
        gender: user.gender,
        preferred_language: user.preferences.language,
        preferred_currency: user.preferences.currency
      })
      
      // Update notification preferences
      await updateNotificationPreferences(user.id, {
        email_notifications: user.notifications.email,
        sms_notifications: user.notifications.sms,
        push_notifications: user.notifications.push,
        newsletter_subscription: user.preferences.newsletter
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving user data:', error)
      alert('Kaydetme sırasında bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
              <span className="text-gray-600">Kullanıcı bilgileri yükleniyor...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h1>
            <p className="text-gray-600 mb-6">Hesap ayarlarınıza erişmek için lütfen giriş yapın.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-luxury-serif text-luxury-charcoal">Profil Bilgileri</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={saving}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors disabled:opacity-50"
        >
          <Edit2 className="h-4 w-4" />
          <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
        </button>
      </div>

      {/* VIP Status */}
      <div className="bg-gradient-to-r from-luxury-gold/10 to-luxury-gold/5 p-6 rounded-lg border border-luxury-gold/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getTierIcon(user.vipTier)}
            <div>
              <h3 className="font-semibold text-luxury-charcoal">VIP {user.vipTier} Üye</h3>
              <p className="text-sm text-gray-600">{user.points} puan</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getTierColor(user.vipTier)}`}>
            {user.vipTier} Seviye
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Sonraki seviyeye</span>
            <span className="font-medium">{user.nextTierPoints - user.points} puan</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-luxury-gold h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(user.points / user.nextTierPoints) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            value={user.email}
            disabled={true}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            title="E-posta adresi değiştirilemez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser({...user, phone: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
          <input
            type="date"
            value={user.birthDate}
            onChange={(e) => setUser({...user, birthDate: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
          <select
            value={user.gender}
            onChange={(e) => setUser({...user, gender: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="male">Erkek</option>
            <option value="female">Kadın</option>
            <option value="other">Diğer</option>
            <option value="prefer-not-to-say">Belirtmek istemiyorum</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={user.preferences.language}
            onChange={(e) => setUser({...user, preferences: {...user.preferences, language: e.target.value}})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
          >
            <option value="en">English</option>
            <option value="fr-CA">Français (Canada)</option>
          </select>
        </div>
      </div>

      {isEditing && (
        <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={saving}
            className="px-6 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            İptal
          </button>
        </div>
      )}
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-luxury-serif text-luxury-charcoal">Bildirim Ayarları</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">E-posta Bildirimleri</h3>
            <p className="text-sm text-gray-600">Sipariş güncellemeleri ve özel teklifler</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.notifications.email}
              onChange={(e) => setUser({...user, notifications: {...user.notifications, email: e.target.checked}})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">SMS Bildirimleri</h3>
            <p className="text-sm text-gray-600">Kargo takibi ve acil bildirimler</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.notifications.sms}
              onChange={(e) => setUser({...user, notifications: {...user.notifications, sms: e.target.checked}})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Push Bildirimleri</h3>
            <p className="text-sm text-gray-600">Anlık uygulamalı bildirimler</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.notifications.push}
              onChange={(e) => setUser({...user, notifications: {...user.notifications, push: e.target.checked}})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Bülten Aboneliği</h3>
            <p className="text-sm text-gray-600">Yeni koleksiyonlar ve özel indirimler</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.preferences.newsletter}
              onChange={(e) => setUser({...user, preferences: {...user.preferences, newsletter: e.target.checked}})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-gold"></div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>
    </div>
  )

  const renderAccountOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-luxury-gold/10 via-luxury-gold/5 to-transparent p-6 rounded-lg border border-luxury-gold/20">
        <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-2">
          Hoş geldiniz, {user.name}!
        </h2>
        <p className="text-gray-600 mb-4">
          Hayaku ailesinin değerli bir üyesi olarak özel ayrıcalıklarınızdan faydalanın.
        </p>
        <div className="flex items-center space-x-2 text-sm">
          {getTierIcon(user.vipTier)}
          <span className="font-medium text-luxury-charcoal">VIP {user.vipTier} Üye</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{user.points} puan</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Package className="h-8 w-8 text-luxury-gold" />
            <div className="text-right">
              <div className="text-2xl font-bold text-luxury-charcoal">{user.orders}</div>
              <div className="text-sm text-gray-600">Toplam Sipariş</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Bu ay: 0 sipariş</div>
        </div>
        
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Heart className="h-8 w-8 text-red-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-luxury-charcoal">{user.wishlist}</div>
              <div className="text-sm text-gray-600">Favori Ürün</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Bu hafta: 0 eklendi</div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Crown className="h-8 w-8 text-purple-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-luxury-charcoal">{user.points}</div>
              <div className="text-sm text-gray-600">VIP Puanı</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">Sonraki seviye: {user.nextTierPoints - user.points} puan</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/products" className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group text-center">
            <Package className="h-8 w-8 text-luxury-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-gray-700">Alışveriş Yap</div>
          </Link>
          <Link href="/orders" className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group text-center">
            <Package className="h-8 w-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-gray-700">Siparişlerim</div>
          </Link>
          <Link href="/wishlist" className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-gray-700">Favorilerim</div>
          </Link>
          <Link href="/contact" className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all group text-center">
            <Bell className="h-8 w-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-sm font-medium text-gray-700">Destek</div>
          </Link>
        </div>
      </div>

      {/* VIP Benefits */}
      <div className="bg-gradient-to-br from-luxury-gold/5 to-luxury-gold/10 p-6 rounded-lg border border-luxury-gold/20">
        <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4 flex items-center">
          <Crown className="h-6 w-6 text-luxury-gold mr-2" />
          VIP {user.vipTier} Avantajlarınız
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
              <span className="text-gray-700">Ücretsiz kargo tüm siparişlerde</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
              <span className="text-gray-700">Özel koleksiyonlara erken erişim</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
              <span className="text-gray-700">Kişisel alışveriş danışmanlığı</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
              <span className="text-gray-700">Öncelikli müşteri desteği</span>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Seviye ilerlemesi</span>
            <span className="font-medium text-luxury-charcoal">{Math.round((user.points / user.nextTierPoints) * 100)}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-luxury-gold to-yellow-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((user.points / user.nextTierPoints) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {user.nextTierPoints - user.points} puan daha ile sonraki seviyeye geçebilirsiniz
          </p>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div>
        <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">Son Aktiviteler</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Henüz aktivite bulunmuyor</p>
            <Link href="/products" className="inline-flex items-center px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors">
              Alışverişe Başla
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl lg:text-4xl font-luxury-serif text-luxury-charcoal">
                Hayaku Dashboard
              </h1>
              <div className="hidden sm:flex items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs font-medium text-green-700">VIP Active</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-luxury-charcoal">{user.name}</h3>
                    <p className="text-gray-600 text-sm">VIP {user.vipTier} Üye</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'overview' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Genel Bakış</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Profil Bilgileri</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <Package className="h-5 w-5" />
                    <span>Siparişlerim</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'wishlist' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favorilerim</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Adreslerim</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'payment' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Ödeme Yöntemlerim</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === 'notifications' 
                        ? 'bg-luxury-gold/10 text-luxury-gold' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-luxury-gold'
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Bildirim Ayarları</span>
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {activeTab === 'overview' && renderAccountOverview()}
                {activeTab === 'profile' && renderProfileSettings()}
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">Siparişlerim</h2>
                    <p className="text-gray-600 mb-4">Henüz sipariş bulunmuyor.</p>
                    <Link
                      href="/orders"
                      className="inline-flex items-center px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
                    >
                      Tüm Siparişleri Görüntüle
                    </Link>
                  </div>
                )}
                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">Favorilerim</h2>
                    <p className="text-gray-600 mb-4">Henüz favori ürün bulunmuyor.</p>
                    <Link
                      href="/wishlist"
                      className="inline-flex items-center px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
                    >
                      Favorilere Git
                    </Link>
                  </div>
                )}
                {activeTab === 'addresses' && (
                  <div>
                    <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">Adreslerim</h2>
                    <p className="text-gray-600">Henüz kayıtlı adres bulunmuyor.</p>
                  </div>
                )}
                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">Ödeme Yöntemlerim</h2>
                    <p className="text-gray-600">Henüz kayıtlı ödeme yöntemi bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}