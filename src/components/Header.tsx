'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, User, Menu, X, Globe } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getBrands } from '@/lib/products'
import { useTranslation, locales, Locale } from '@/lib/i18n'
import UserProfile from './UserProfile'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const [brands, setBrands] = useState<any[]>([])
  const { t } = useTranslation(currentLocale)
  const { cart, toggleCart, isMobileMenuOpen, toggleMobileMenu } = useStore()
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const data = await getBrands(true)
      setBrands(data)
    } catch (error) {
      console.error('Error loading brands:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="hidden md:flex justify-center py-2 text-xs font-medium tracking-wide text-gray-600 bg-luxury-black text-white">
          FREE SHIPPING OVER $200 CAD • VIP ACCESS • EXCLUSIVE COLLECTIONS
        </div>
        
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Hayaku Logo"
                width={40}
                height={40}
                className="rounded-sm"
              />
              <span className="font-luxury-serif text-2xl font-bold tracking-tight">HAYAKU</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link href="/brands" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">
                {t('brands')}
              </Link>
              {/* Mega Menu */}
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white rounded-lg shadow-xl border p-6 w-[600px] max-h-96 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="font-luxury-serif text-lg font-bold text-luxury-charcoal mb-1">All Brands</h3>
                    <p className="text-sm text-gray-500">{brands.length} brands</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {brands.map((brand: any) => (
                      <Link 
                        key={brand.id} 
                        href={`/brands/${brand.slug}`}
                        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group/brand"
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={`/brands/${brand.slug}.png`}
                            alt={`${brand.name} logo`}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('.svg')) {
                                target.src = `/brands/${brand.slug}.svg`;
                              } else {
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-8 h-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                                    <span class="text-xs font-bold text-luxury-gold">${brand.name.charAt(0)}</span>
                                  </div>`;
                                }
                              }
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-gray-900 group-hover/brand:text-luxury-gold transition-colors truncate">
                              {brand.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">{brand.country}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link 
                      href="/brands" 
                      className="flex items-center justify-center w-full px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
                    >
                      View All Brands
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <Link href="/products?new=true" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('newArrivals')}</Link>
            <Link href="/products?category=clothing" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('clothing')}</Link>
            <Link href="/products?category=footwear" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('footwear')}</Link>
            <Link href="/products?category=accessories" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('accessories')}</Link>
            <Link href="/products?category=home-textiles" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('homeTextiles')}</Link>
            <Link href="/products?sale=true" className="font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('sale')}</Link>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group hidden md:block">
              <button className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{currentLocale === 'en' ? 'EN' : currentLocale === 'fr-CA' ? 'FR' : currentLocale.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white rounded-lg shadow-xl border py-2 w-24">
                  {locales.map((locale: Locale) => (
                    <button
                      key={locale}
                      onClick={() => setCurrentLocale(locale)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        currentLocale === locale ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {locale === 'en' ? 'English' : locale === 'fr-CA' ? 'Français' : locale.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* User Profile */}
            <div className="hidden md:block">
              <UserProfile />
            </div>
            
            {/* Shopping Cart */}
            <button 
              onClick={toggleCart}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 py-4 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                autoFocus
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-screen overflow-y-auto">
          <div className="px-4 py-6 space-y-4">
            {/* Main Navigation */}
            <Link href="/products?new=true" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('newArrivals')}</Link>
            <Link href="/products?category=clothing" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('clothing')}</Link>
            <Link href="/products?category=footwear" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('footwear')}</Link>
            <Link href="/products?category=accessories" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('accessories')}</Link>
            <Link href="/products?category=home-textiles" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('homeTextiles')}</Link>
            <Link href="/products?sale=true" className="block font-medium text-gray-900 hover:text-luxury-gold transition-colors">{t('sale')}</Link>
            
            {/* Brands Section */}
            <div className="pt-4 border-t border-gray-200">
              <div className="mb-3">
                <Link href="/brands" className="flex items-center justify-between font-medium text-gray-900 hover:text-luxury-gold transition-colors">
                  <span>{t('brands')}</span>
                  <span className="text-xs text-gray-500">({brands.length})</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {brands.map((brand: any) => (
                  <Link 
                    key={brand.id} 
                    href={`/brands/${brand.slug}`}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <img 
                      src={`/brands/${brand.slug}.png`}
                      alt={`${brand.name} logo`}
                      className="w-6 h-6 object-contain flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('.svg')) {
                          target.src = `/brands/${brand.slug}.svg`;
                        } else {
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-6 h-6 bg-luxury-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span class="text-xs font-bold text-luxury-gold">${brand.name.charAt(0)}</span>
                            </div>`;
                          }
                        }
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-gray-900 truncate">{brand.name}</div>
                      <div className="text-xs text-gray-500 truncate">{brand.country}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Account Section */}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/account" className="flex items-center space-x-3 text-gray-700 hover:text-luxury-gold transition-colors">
                <User className="h-5 w-5" />
                <span>{t('account')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}