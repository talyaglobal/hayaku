'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getBrands } from '@/lib/products'

export default function BrandCarousel() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const data = await getBrands(true) // Get active brands only
      setBrands((data as any[]).filter((brand: any) => brand.is_featured)) // Filter featured brands
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-luxury-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Köklü Markalar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Onlarca yıllık ödünsüz işçilik ve lüks geleneğine sahip dünyanın en prestijli 
            moda evlerinden özenle seçilmiş koleksiyonları keşfedin.
          </p>
        </motion.div>
        
        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {brands.map((brand: any, index: number) => (
            <Link href={`/brands/${brand.slug}`} key={brand.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="brand-card cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
              <div className="aspect-square bg-gray-50 rounded-lg p-8 flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center p-6">
                    <img 
                      src={`/brands/${brand.slug}.png`}
                      alt={`${brand.name} logo`}
                      className="w-32 h-32 object-contain"
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
                              <span class="font-luxury-serif text-2xl font-bold text-luxury-gold">${brand.name.charAt(0)}</span>
                            </div>`;
                          }
                        }
                      }}
                    />
                  </div>
                  <h3 className="font-luxury-serif text-3xl font-bold text-gray-900">
                    {brand.name}
                  </h3>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ülke</span>
                  <span className="font-medium">{brand.country || 'Italy'}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {brand.description || 'Lüks moda koleksiyonu'}
                </p>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>
        
        {/* View All Brands Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/brands" className="luxury-button-outline">
            Tüm {brands.length} Markayı Görüntüle
          </Link>
        </motion.div>
      </div>
    </section>
  )
}