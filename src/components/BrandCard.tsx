'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
interface BrandCardProps {
  brand: any
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.slug}`}>
      <motion.div
        className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center p-8">
          <div className="w-full h-full relative flex items-center justify-center">
            <img 
              src={`/brands/${brand.slug}.png`}
              alt={`${brand.name} logo`}
              className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
              style={{ minWidth: '120px', minHeight: '80px' }}
              onError={(e) => {
                // Fallback to SVG if PNG doesn't exist (for Moncler)
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('.svg')) {
                  target.src = `/brands/${brand.slug}.svg`;
                } else {
                  // Final fallback to placeholder
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-32 h-32 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                      <span class="text-5xl font-luxury-serif font-bold text-luxury-gold">${brand.name.charAt(0)}</span>
                    </div>`;
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-2">
            <h3 className="text-xl font-luxury-serif text-luxury-charcoal">
              {brand.name}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {brand.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {brand.country}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              brand.is_featured
                ? 'bg-luxury-gold text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {brand.is_featured ? 'Öne Çıkan' : 'Marka'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}