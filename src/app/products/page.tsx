'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'
import ProductCard from '@/components/ProductCard'
import { getProducts, getBrands, getCategories } from '@/lib/products'
import { useTranslation } from '@/lib/i18n'
import { Filter, Grid, List, RotateCcw } from 'lucide-react'
import MultiSelect from '@/components/MultiSelect'

function ProductsContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>('name')
  const [products, setProducts] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Load data and handle URL parameters
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const sort = searchParams.get('sort')
    const view = searchParams.get('view')
    
    if (category) setSelectedCategories([category])
    if (brand) setSelectedBrands([brand])
    if (sort) setSortBy(sort)
    if (view === 'list' || view === 'grid') setViewMode(view)
  }, [searchParams])

  const loadData = async () => {
    try {
      const [productsData, brandsData, categoriesData] = await Promise.all([
        getProducts({ limit: 100 }),
        getBrands(true),
        getCategories(true)
      ])
      setProducts(productsData)
      setBrands(brandsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter(product => selectedBrands.length === 0 || selectedBrands.includes(product.brand_id))
    .filter(product => selectedCategories.length === 0 || selectedCategories.includes(product.category_id))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

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

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      <BackButton />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4 flex items-center text-black">
                <Filter className="mr-2 h-5 w-5" />
                Filtreler
              </h3>
              
              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-black">{t('brands')}</h4>
                <MultiSelect
                  options={brands.map(brand => ({ id: brand.id, name: brand.name }))}
                  selectedValues={selectedBrands}
                  onChange={setSelectedBrands}
                  placeholder="Marka seçin"
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-black">{t('categories')}</h4>
                <MultiSelect
                  options={categories.map(category => ({ id: category.id, name: category.name }))}
                  selectedValues={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Kategori seçin"
                  className="w-full"
                />
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setSelectedBrands([])
                  setSelectedCategories([])
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Filtreleri Sıfırla
              </button>
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
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}