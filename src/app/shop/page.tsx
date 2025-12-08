'use client'

import { useState } from 'react'
import { products } from '../../lib/products'
import { features } from '../../lib/features'

interface FilterState {
  priceRange: 'all' | 'under-100' | '100-200' | 'over-200'
  capacity: 'all' | 'basic' | 'power' | 'ultimate'
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name'
}

export default function ShopPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    capacity: 'all',
    sortBy: 'featured'
  })

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const formatPrice = (priceRange: string) => {
    // Extract numeric price for comparison (e.g., "$89 - $109 CAD" -> 89)
    const match = priceRange.match(/\$(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  const filteredAndSortedProducts = products
    .filter(product => {
      // Price filter
      if (filters.priceRange !== 'all') {
        const price = formatPrice(product.price)
        switch (filters.priceRange) {
          case 'under-100':
            return price < 100
          case '100-200':
            return price >= 100 && price <= 200
          case 'over-200':
            return price > 200
        }
      }

      // Capacity filter
      if (filters.capacity !== 'all') {
        switch (filters.capacity) {
          case 'basic':
            return product.id === 'hayabusax1'
          case 'power':
            return product.id === 'hayabusax2power'
          case 'ultimate':
            return product.id === 'lifepack'
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return formatPrice(a.price) - formatPrice(b.price)
        case 'price-high':
          return formatPrice(b.price) - formatPrice(a.price)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'featured':
        default:
          return b.popular ? 1 : -1
      }
    })

  const handleAddToCart = (productId: string) => {
    setSelectedProduct(productId)
    // Simulate add to cart
    setTimeout(() => {
      setSelectedProduct(null)
    }, 2000)
  }

  const getDiscountPercentage = (originalPrice: string) => {
    // Mock discount calculation for demonstration
    const price = formatPrice(originalPrice)
    if (price >= 200) return 15
    if (price >= 150) return 10
    if (price >= 100) return 8
    return 5
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Shop HAYAKU
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Tech backpacks engineered by Gen Z, for Gen Z. Safe, stylish, and actually useful.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'under-100', label: 'Under $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: 'over-200', label: 'Over $200' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value as any }))}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Power Level</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Models' },
                    { value: 'basic', label: 'Basic (HAYABUSAX1)' },
                    { value: 'power', label: 'Power User' },
                    { value: 'ultimate', label: 'Ultimate Safety' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="capacity"
                        value={option.value}
                        checked={filters.capacity === option.value}
                        onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value as any }))}
                        className="mr-2 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
              </h2>
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    product.popular ? 'ring-2 ring-red-500' : ''
                  }`}
                >
                  {/* Product Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${
                      product.popular 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-900 text-white'
                    }`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {getDiscountPercentage(product.price)}% OFF
                  </div>

                  {/* Product Image */}
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="text-8xl opacity-50">🎒</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-600">
                            <span className="text-green-500 mr-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        <span className="text-sm text-gray-500 ml-1">CAD</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 line-through">
                          ${formatPrice(product.price) + Math.round(formatPrice(product.price) * getDiscountPercentage(product.price) / 100)} CAD
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Save ${Math.round(formatPrice(product.price) * getDiscountPercentage(product.price) / 100)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={selectedProduct === product.id}
                        className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
                          selectedProduct === product.id
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : product.popular
                            ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                            : 'bg-gray-900 hover:bg-gray-800 text-white transform hover:scale-105'
                        }`}
                      >
                        {selectedProduct === product.id ? '✓ Added to Cart' : product.cta}
                      </button>
                      
                      <button className="w-full py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => setFilters({ priceRange: 'all', capacity: 'all', sortBy: 'featured' })}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Why Choose HAYAKU Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose HAYAKU?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.slice(0, 6).map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Section */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">HAYAKU Guarantee</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center justify-center gap-2">
              <span>🚚</span>
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>↩️</span>
              <span className="text-sm">30-Day Returns</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>🛡️</span>
              <span className="text-sm">2-Year Warranty</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span>🔥</span>
              <span className="text-sm">Gen Z Made</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}