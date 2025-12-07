'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Home, Bed, Utensils, Bath, Grid, List } from 'lucide-react'

// Mock home textiles products data
const homeTextilesProducts = [
  {
    id: 'ht-001',
    name: 'Premium Egyptian Cotton Bedding Set',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 2850,
    category: 'home-textiles',
    subcategory: 'bedding',
    description: 'Luxury Egyptian cotton bedding set with 600 thread count for ultimate comfort.',
    images: [
      'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    sizes: ['Single', 'Double', 'King', 'Super King'],
    colors: ['White', 'Ivory', 'Grey', 'Navy'],
    materials: ['Egyptian Cotton'],
    inStock: true,
    isLimitedEdition: false,
    isNew: true,
    craftedIn: 'Egypt'
  },
  {
    id: 'ht-002',
    name: 'Cashmere Throw Blanket',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 1650,
    category: 'home-textiles',
    subcategory: 'throws',
    description: 'Ultra-soft cashmere throw blanket perfect for luxury living rooms.',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'
    ],
    sizes: ['130x180cm', '150x200cm'],
    colors: ['Camel', 'Charcoal', 'Cream', 'Rose'],
    materials: ['100% Cashmere'],
    inStock: true,
    isLimitedEdition: true,
    isNew: false,
    craftedIn: 'Scotland'
  },
  {
    id: 'ht-003',
    name: 'Silk Cushion Cover Set',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 425,
    category: 'home-textiles',
    subcategory: 'cushions',
    description: 'Set of 4 premium silk cushion covers with elegant designs.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg'
    ],
    sizes: ['45x45cm', '50x50cm', '60x60cm'],
    colors: ['Gold', 'Silver', 'Burgundy', 'Forest Green'],
    materials: ['Mulberry Silk'],
    inStock: true,
    isLimitedEdition: false,
    isNew: true,
    craftedIn: 'Turkey'
  },
  {
    id: 'ht-004',
    name: 'Turkish Bath Towel Set',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 340,
    category: 'home-textiles',
    subcategory: 'bathroom',
    description: 'Premium Turkish cotton bath towel set with superior absorbency.',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'
    ],
    sizes: ['Bath Towel', 'Hand Towel', 'Face Towel'],
    colors: ['White', 'Beige', 'Anthracite', 'Sage'],
    materials: ['Turkish Cotton'],
    inStock: true,
    isLimitedEdition: false,
    isNew: false,
    craftedIn: 'Turkey'
  },
  {
    id: 'ht-005',
    name: 'Linen Table Runner',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 180,
    category: 'home-textiles',
    subcategory: 'table-linen',
    description: 'Pure linen table runner for elegant dining experiences.',
    images: [
      'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    sizes: ['180x35cm', '200x35cm', '220x35cm'],
    colors: ['Natural', 'Stone', 'Charcoal', 'Sage'],
    materials: ['Pure Linen'],
    inStock: true,
    isLimitedEdition: false,
    isNew: true,
    craftedIn: 'Lithuania'
  },
  {
    id: 'ht-006',
    name: 'Velvet Curtain Panels',
    brand: 'Hayaku Home',
    brandId: 'hayaku-home',
    price: 890,
    originalPrice: 1200,
    category: 'home-textiles',
    subcategory: 'window-treatments',
    description: 'Luxurious velvet curtain panels with blackout lining.',
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'
    ],
    sizes: ['140x240cm', '140x280cm', '200x280cm'],
    colors: ['Deep Blue', 'Emerald', 'Burgundy', 'Charcoal'],
    materials: ['Cotton Velvet', 'Blackout Lining'],
    inStock: true,
    isLimitedEdition: false,
    isNew: false,
    craftedIn: 'Italy'
  }
]

const categories = [
  { id: 'bedding', name: 'Yatak Takımları', icon: Bed, count: 45 },
  { id: 'throws', name: 'Battaniye & Örtü', icon: Home, count: 28 },
  { id: 'cushions', name: 'Yastık & Minder', icon: Home, count: 67 },
  { id: 'bathroom', name: 'Banyo Tekstili', icon: Bath, count: 34 },
  { id: 'table-linen', name: 'Masa Örtüsü', icon: Utensils, count: 23 },
  { id: 'window-treatments', name: 'Perde & Fon', icon: Home, count: 19 }
]

export default function HomeTextilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('name')

  const filteredProducts = homeTextilesProducts
    .filter(product => !selectedCategory || product.subcategory === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Home className="h-16 w-16 mr-4 text-amber-700" />
              <h1 className="text-5xl md:text-7xl font-luxury-serif font-bold text-amber-900">
                EV TEKSTİLİ
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto text-amber-800">
              Evinizin her köşesini lüks ve konforla süsleyen premium ev tekstili koleksiyonu
            </p>
            <div className="flex items-center justify-center space-x-8 text-lg text-amber-700">
              <div className="flex items-center">
                <Bed className="h-6 w-6 mr-2" />
                <span>Premium Kumaşlar</span>
              </div>
              <div className="flex items-center">
                <Home className="h-6 w-6 mr-2" />
                <span>El İşçiliği</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center text-amber-900">
                <Home className="mr-2 h-5 w-5" />
                Kategoriler
              </h3>
              
              {/* All Categories Button */}
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tüm Kategoriler</span>
                  <span className="text-sm text-gray-500">{homeTextilesProducts.length}</span>
                </div>
              </button>

              {/* Category Buttons */}
              {categories.map(category => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                      selectedCategory === category.id 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className="h-4 w-4 mr-2" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{filteredProducts.length} ürün</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="name">İsme Göre</option>
                  <option value="price">Fiyata Göre</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-amber-200' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-amber-200' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Bu kategoride şu anda ürün bulunmuyor
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}