'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getBrands, getProducts } from '@/lib/products'
import { motion } from 'framer-motion'

interface BrandPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function BrandPage({ params }: BrandPageProps) {
  const [brand, setBrand] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBrandData()
  }, [])

  const loadBrandData = async () => {
    try {
      const resolvedParams = await params
      const { slug } = resolvedParams
      
      const brands = await getBrands(true)
      const foundBrand = (brands as any[]).find((b: any) => b.slug === slug)
      
      if (!foundBrand) {
        notFound()
        return
      }
      
      setBrand(foundBrand)
      
      const allProducts = await getProducts({ brandId: foundBrand.id })
      setProducts(allProducts)
    } catch (error) {
      console.error('Error loading brand data:', error)
      notFound()
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

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main>
        {/* Brand Hero */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700"></div>
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div 
                className="max-w-4xl mx-auto text-center text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Brand Logo */}
                <div className="mb-8">
                  <div className="w-40 h-40 mx-auto bg-white rounded-lg flex items-center justify-center p-6">
                    <div className="w-32 h-32 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                      <span className="font-luxury-serif text-4xl font-bold text-luxury-gold">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-luxury-serif font-bold mb-6">
                  {brand.name}
                </h1>
                <p className="text-xl md:text-2xl mb-4 opacity-90">
                  {brand.description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <span>{brand.country || 'Italy'}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-luxury-serif font-bold mb-6">Marka Hikayesi</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {brand.description || 'Lüks moda koleksiyonu'}
                </p>
              </motion.div>

              {/* Brand Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-luxury-black mb-2">{brand.country || 'Italy'}</div>
                  <div className="text-gray-600">Menşei</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-luxury-black mb-2">
                    {brand.is_featured ? 'Öne Çıkan' : 'Premium'}
                  </div>
                  <div className="text-gray-600">Kategori</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-luxury-serif font-bold text-center mb-12">
                {brand.name} Koleksiyonu
              </h2>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">
                    Bu marka için ürünler yakında eklenecek.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}