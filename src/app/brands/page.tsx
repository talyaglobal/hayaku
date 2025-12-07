'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'
import BrandCard from '@/components/BrandCard'
import { getBrands } from '@/lib/products'
import { useTranslation } from '@/lib/i18n'

export default function BrandsPage() {
  const { t } = useTranslation()
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrands()
  }, [])

  const loadBrands = async () => {
    try {
      const data = await getBrands(true)
      setBrands(data)
    } catch (error) {
      console.error('Error loading brands:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
        </div>
        <Footer />
      </div>
    )
  }

  const featuredBrands = brands.filter(brand => brand.is_featured)
  const allBrands = brands.filter(brand => !brand.is_featured)

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      <BackButton />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-luxury-serif text-luxury-charcoal mb-6">
            Premium Markalar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dünyanın en prestijli moda markalarından özenle seçilmiş koleksiyonlar
          </p>
        </div>

        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-8">
              Öne Çıkan Markalar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBrands.map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}

        {/* All Brands */}
        {allBrands.length > 0 && (
          <section>
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-8">
              All Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allBrands.map(brand => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}