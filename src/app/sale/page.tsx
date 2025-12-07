'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/products'
import { Percent, Clock, Star, Gift } from 'lucide-react'
import ImportExportButtons from '@/components/ImportExportButtons'

export default function SalePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts({ limit: 50 })
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Filter products for sales
  const saleProducts = products.filter(product => product.compare_price && product.compare_price > product.price)
  const newProducts = products.filter(product => product.is_featured)
  const limitedProducts = products.filter(product => product.tags?.includes('limited'))
  
  // Mock campaign data
  const campaigns = [
    {
      id: 'winter2025',
      title: 'Kış Koleksiyonu İndirimi',
      description: 'Kış ürünlerinde %40\'a varan indirim fırsatı',
      discount: '40%',
      validUntil: '2025-02-28',
      image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
      category: 'outerwear',
      active: true
    },
    {
      id: 'luxury2025', 
      title: 'Luxury Brands Special',
      description: 'Premium markalarda özel fiyat avantajı',
      discount: '25%',
      validUntil: '2025-02-15',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      category: 'luxury',
      active: true
    },
    {
      id: 'spring2025',
      title: 'Bahar Hazırlığı',
      description: 'Yeni sezon ürünlerinde erken rezervasyon indirimi',
      discount: '15%',
      validUntil: '2025-03-31',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      category: 'clothing',
      active: true
    }
  ]

  const getProductsByTab = () => {
    switch(activeTab) {
      case 'sale': return saleProducts
      case 'new': return newProducts
      case 'limited': return limitedProducts
      default: return [...saleProducts, ...newProducts, ...limitedProducts]
    }
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Percent className="h-16 w-16 mr-4" />
              <h1 className="text-5xl md:text-7xl font-luxury-serif font-bold">
                İNDİRİM
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Lüks moda koleksiyonlarında kaçırılmayacak fırsatlar sizi bekliyor
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                <span>Sınırlı Süre</span>
              </div>
              <div className="flex items-center">
                <Star className="h-6 w-6 mr-2" />
                <span>Premium Markalar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Import/Export Controls */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-luxury-serif text-luxury-charcoal">Kampanyalar & İndirimler</h2>
          <ImportExportButtons
            data={[...campaigns, ...getProductsByTab()]}
            filename="campaigns_and_sales"
            entityName="kampanya"
          />
        </div>
        
        {/* Active Campaigns */}
        <section className="mb-16">
          <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-8 text-center">
            Aktif Kampanyalar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {campaigns.filter(campaign => campaign.active).map(campaign => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${campaign.image})` }}
                  ></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white text-lg font-bold px-3 py-2 rounded-full">
                      -{campaign.discount}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-2">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {campaign.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-red-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{campaign.validUntil} tarihine kadar</span>
                    </div>
                    <button className="text-luxury-gold hover:text-amber-600 font-medium">
                      Ürünleri Gör →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Product Tabs */}
        <section>
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'all' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Tümü ({saleProducts.length + newProducts.length + limitedProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'sale' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                İndirimli ({saleProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'new' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Yeni Gelenler ({newProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('limited')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'limited' ? 'bg-red-600 text-white' : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Sınırlı Edisyon ({limitedProducts.length})
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {getProductsByTab().map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {getProductsByTab().length === 0 && (
                <div className="text-center py-16">
                  <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Bu kategoride şu anda ürün bulunmuyor
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  )
}