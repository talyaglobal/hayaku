'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, ChevronDown, Settings, Package, Heart, LogOut, Crown, Award, Star, Diamond } from 'lucide-react'

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    avatar: null,
    vipTier: 'Gold' as 'Bronze' | 'Gold' | 'Platinum' | 'Diamond',
    points: 1250,
    nextTierPoints: 2500,
    orders: 12,
    wishlist: 8
  }

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'Bronze': return <Award className="h-4 w-4 text-amber-700" />
      case 'Gold': return <Star className="h-4 w-4 text-yellow-500" />
      case 'Platinum': return <Crown className="h-4 w-4 text-purple-500" />
      case 'Diamond': return <Diamond className="h-4 w-4 text-blue-500" />
      default: return <User className="h-4 w-4" />
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-gray-900" />
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Profile Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-luxury-black rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              {/* VIP Tier Badge */}
              <div className={`mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${getTierColor(user.vipTier)}`}>
                {getTierIcon(user.vipTier)}
                <span>VIP {user.vipTier}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 border-b border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user.points}</div>
                  <div className="text-xs text-gray-600">Puan</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user.orders}</div>
                  <div className="text-xs text-gray-600">Sipariş</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user.wishlist}</div>
                  <div className="text-xs text-gray-600">Favori</div>
                </div>
              </div>
              
              {/* Progress to next tier */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Sonraki seviyeye</span>
                  <span>{user.nextTierPoints - user.points} puan</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-luxury-gold h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(user.points / user.nextTierPoints) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link href="/account" className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Hesap Ayarları</span>
              </Link>
              
              <Link href="/orders" className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Siparişlerim</span>
              </Link>
              
              <Link href="/wishlist" className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Heart className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Favorilerim</span>
              </Link>
              
              <div className="border-t border-gray-100 my-2" />
              
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-red-600">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}