'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/logo.jpg"
                alt="Hayaku Logo"
                width={32}
                height={32}
                className="rounded-sm"
              />
              <span className="font-luxury-serif text-2xl font-bold">HAYAKU</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bringing together the world's most prestigious luxury menswear, sophisticated style, and exceptional craftsmanship for the Canadian market.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Customer Service: +1 (XXX) XXX-XXXX</p>
              <p>Email: info@hayaku.ca</p>
            </div>
          </div>
          
          {/* Shop Column */}
          <div>
            <h3 className="font-luxury-serif text-lg font-bold mb-6">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/products?new=true" className="hover:text-luxury-gold transition-colors">{t('newArrivals')}</Link></li>
              <li><Link href="/products?category=clothing" className="hover:text-luxury-gold transition-colors">{t('clothing')}</Link></li>
              <li><Link href="/products?category=footwear" className="hover:text-luxury-gold transition-colors">{t('footwear')}</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-luxury-gold transition-colors">{t('accessories')}</Link></li>
              <li><Link href="/products?category=bags" className="hover:text-luxury-gold transition-colors">{t('bags')}</Link></li>
              <li><Link href="/products?category=watches" className="hover:text-luxury-gold transition-colors">{t('watches')}</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-luxury-gold transition-colors">{t('sale')}</Link></li>
            </ul>
          </div>
          
          {/* Brands Column */}
          <div>
            <h3 className="font-luxury-serif text-lg font-bold mb-6">{t('brands')}</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/brands/prada" className="hover:text-luxury-gold transition-colors">Prada</Link></li>
              <li><Link href="/brands/moncler" className="hover:text-luxury-gold transition-colors">Moncler</Link></li>
              <li><Link href="/brands/burberry" className="hover:text-luxury-gold transition-colors">Burberry</Link></li>
              <li><Link href="/brands/dolce-gabbana" className="hover:text-luxury-gold transition-colors">Dolce & Gabbana</Link></li>
              <li><Link href="/brands/stone-island" className="hover:text-luxury-gold transition-colors">Stone Island</Link></li>
              <li><Link href="/brands/calvin-klein" className="hover:text-luxury-gold transition-colors">Calvin Klein</Link></li>
              <li><Link href="/brands" className="hover:text-luxury-gold transition-colors">{t('viewAll')}</Link></li>
            </ul>
          </div>
          
          {/* Services Column */}
          <div>
            <h3 className="font-luxury-serif text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/vip" className="hover:text-luxury-gold transition-colors">VIP Membership</Link></li>
              <li><Link href="/personal-shopping" className="hover:text-luxury-gold transition-colors">Personal Shopping</Link></li>
              <li><Link href="/size-guide" className="hover:text-luxury-gold transition-colors">{t('sizeGuide')}</Link></li>
              <li><Link href="/care" className="hover:text-luxury-gold transition-colors">Care Instructions</Link></li>
              <li><Link href="/returns" className="hover:text-luxury-gold transition-colors">{t('returns')}</Link></li>
              <li><Link href="/shipping" className="hover:text-luxury-gold transition-colors">{t('shipping')}</Link></li>
              <li><Link href="/contact" className="hover:text-luxury-gold transition-colors">{t('contact')}</Link></li>
            </ul>
            
            {/* Admin Bypass Button */}
            <div className="mt-8 pt-4 border-t border-gray-800">
              <Link 
                href="/admin"
                className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors"
              >
                🔑 Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-luxury-serif text-2xl font-bold mb-4">
              Join the Hayaku Community
            </h3>
            <p className="text-gray-300 mb-8">
              Be the first to discover new arrivals, exclusive collections, and VIP access to luxury fashion events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
              />
              <button className="px-8 py-3 bg-luxury-gold text-luxury-black font-medium rounded-md hover:bg-yellow-400 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <span>&copy; 2025 Hayaku. All rights reserved.</span>
            <a href="#" className="hover:text-luxury-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-luxury-gold transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center space-x-4">
            <span>Accepted Payment Methods:</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-5 bg-gray-700 rounded-sm flex items-center justify-center text-xs">VISA</div>
              <div className="w-8 h-5 bg-gray-700 rounded-sm flex items-center justify-center text-xs">MC</div>
              <div className="w-8 h-5 bg-gray-700 rounded-sm flex items-center justify-center text-xs">AMEX</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}