'use client'

import { useState, useEffect } from 'react'
import { FilterState, Product, SearchResults } from '@/types'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

import SearchFilters from '@/components/SearchFilters'
import SearchAutocomplete from '@/components/SearchAutocomplete'
import SearchHistory from '@/components/SearchHistory'
import RecentlyViewed from '@/components/RecentlyViewed'
import ProductRecommendations from '@/components/ProductRecommendations'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    categories: [],
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    materials: [],
    inStock: false,
    isNew: false,
    isLimitedEdition: false,
  })

  const { addToHistory, getRecentSearches, clearHistory } = useSearchHistory()
  const { addToRecentlyViewed } = useRecentlyViewed()

  // Mock data - in real app, this would come from API
  const [mockProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Luxury Silk Scarf',
      slug: 'luxury-silk-scarf',
      description: 'Premium silk scarf with elegant pattern',
      brand_id: '1',
      category_id: '1',
      price: 299,
      compare_price: 399,
      currency: 'USD',
      is_featured: true,
      is_active: true,
      tags: ['silk', 'luxury', 'accessories'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brands: { name: 'Hermès', slug: 'hermes' },
      categories: { name: 'Accessories', slug: 'accessories' },
      product_images: [{ 
        id: '1', 
        product_id: '1', 
        url: '/api/placeholder/300/300', 
        alt_text: 'Luxury silk scarf',
        position: 1, 
        is_primary: true, 
        created_at: new Date().toISOString() 
      }],
    },
    {
      id: '2',
      name: 'Designer Handbag',
      slug: 'designer-handbag',
      description: 'Elegant leather handbag',
      brand_id: '2',
      category_id: '2',
      price: 1299,
      currency: 'USD',
      is_featured: false,
      is_active: true,
      tags: ['leather', 'handbag', 'luxury'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brands: { name: 'Chanel', slug: 'chanel' },
      categories: { name: 'Handbags', slug: 'handbags' },
      product_images: [{ 
        id: '2', 
        product_id: '2', 
        url: '/api/placeholder/300/300', 
        alt_text: 'Designer handbag',
        position: 1, 
        is_primary: true, 
        created_at: new Date().toISOString() 
      }],
    },
    {
      id: '3',
      name: 'Premium Skincare Set',
      slug: 'premium-skincare-set',
      description: 'Complete luxury skincare routine',
      brand_id: '3',
      category_id: '3',
      price: 599,
      currency: 'USD',
      is_featured: true,
      is_active: true,
      tags: ['skincare', 'premium', 'beauty'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      brands: { name: 'La Prairie', slug: 'la-prairie' },
      categories: { name: 'Beauty', slug: 'beauty' },
      product_images: [{ 
        id: '3', 
        product_id: '3', 
        url: '/api/placeholder/300/300', 
        alt_text: 'Premium skincare set',
        position: 1, 
        is_primary: true, 
        created_at: new Date().toISOString() 
      }],
    },
  ])

  const availableBrands = ['Hermès', 'Chanel', 'Louis Vuitton', 'Gucci', 'Prada', 'La Prairie']
  const availableCategories = ['Accessories', 'Handbags', 'Beauty', 'Fragrances', 'Watches', 'Jewelry']

  // Perform search
  const performSearch = async (query: string, currentFilters: FilterState = filters) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock search logic
      const filteredProducts = mockProducts.filter(product => {
        // Text search
        const searchTerms = query.toLowerCase().split(' ')
        const productText = `${product.name} ${product.description} ${product.brands?.name} ${product.categories?.name}`.toLowerCase()
        const matchesText = searchTerms.every(term => productText.includes(term))
        
        if (!matchesText) return false
        
        // Apply filters
        if (currentFilters.brands.length > 0 && !currentFilters.brands.includes(product.brands?.name || '')) return false
        if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(product.categories?.name || '')) return false
        if (product.price < currentFilters.priceRange[0] || product.price > currentFilters.priceRange[1]) return false
        if (currentFilters.inStock && !product.is_active) return false
        if (currentFilters.isNew && new Date(product.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) return false
        if (currentFilters.isLimitedEdition && !product.tags?.includes('limited')) return false
        
        return true
      })

      const results: SearchResults = {
        query,
        totalResults: filteredProducts.length,
        results: {
          products: filteredProducts,
          brands: availableBrands.filter(brand => 
            brand.toLowerCase().includes(query.toLowerCase())
          ).map(name => ({ 
            id: name.toLowerCase(), 
            name, 
            slug: name.toLowerCase().replace(' ', '-'),
            is_featured: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          categories: availableCategories.filter(category => 
            category.toLowerCase().includes(query.toLowerCase())
          ).map(name => ({ 
            id: name.toLowerCase(), 
            name, 
            slug: name.toLowerCase().replace(' ', '-'),
            is_featured: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
        }
      }

      setSearchResults(results)
      addToHistory(query, results.totalResults, currentFilters)
      
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults({
        query,
        totalResults: 0,
        results: { products: [], brands: [], categories: [] }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      performSearch(query)
      setShowHistory(false)
    } else {
      setSearchResults(null)
    }
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (searchQuery.trim()) {
      performSearch(searchQuery, newFilters)
    }
  }

  const handleSuggestionSelect = (suggestion: any) => {
    if (suggestion.type === 'product') {
      handleProductClick(suggestion as any)
    } else {
      handleSearch(suggestion.title)
    }
  }

  const handleProductClick = (product: Product) => {
    addToRecentlyViewed(product)
    // Navigate to product page
    console.log('Navigate to product:', product.id)
  }

  const handleSearchSelect = (query: string) => {
    handleSearch(query)
  }

  const recentSearches = getRecentSearches(5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Search Products
            </h1>
            
            <div className="relative">
              <SearchAutocomplete
                onSelect={handleSuggestionSelect}
                onSearch={handleSearch}
                recentSearches={recentSearches}
                onClearRecentSearches={clearHistory}
              />
              
              {/* Search History Toggle */}
              {recentSearches.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="mt-3 text-sm text-blue-500 hover:text-blue-600"
                >
                  {showHistory ? 'Hide' : 'Show'} Search History
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search History Panel */}
            {showHistory && (
              <div className="mb-6">
                <SearchHistory
                  onSearchSelect={handleSearchSelect}
                  onClose={() => setShowHistory(false)}
                  maxVisible={10}
                />
              </div>
            )}

            {/* Search Filters */}
            {(searchQuery || searchResults) && (
              <SearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                brands={availableBrands}
                categories={availableCategories}
                totalResults={searchResults?.totalResults || 0}
              />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="py-12 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {searchResults && !isLoading && (
              <div className="mt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Search Results for "{searchResults.query}"
                  </h2>
                  <p className="text-gray-600">
                    {searchResults.totalResults} products found
                  </p>
                </div>

                {searchResults.totalResults > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.results.products.map(product => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <img
                          src={product.product_images?.[0]?.url || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                          {product.brands && (
                            <p className="text-sm text-gray-500 mb-2">{product.brands.name}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">
                                ${product.price}
                              </span>
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.compare_price}
                                </span>
                              )}
                            </div>
                            {product.is_featured && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults(null)
                        setFilters({
                          brands: [],
                          categories: [],
                          priceRange: [0, 10000],
                          sizes: [],
                          colors: [],
                          materials: [],
                          inStock: false,
                          isNew: false,
                          isLimitedEdition: false,
                        })
                      }}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Default State - No Search */}
            {!searchQuery && !searchResults && !showHistory && (
              <div className="space-y-8">
                {/* Recently Viewed */}
                <RecentlyViewed
                  onProductClick={handleProductClick}
                  displayMode="grid"
                  maxItems={8}
                  showAnalytics={true}
                />

                {/* Product Recommendations */}
                <ProductRecommendations
                  allProducts={mockProducts}
                  onProductClick={handleProductClick}
                  title="Recommended for You"
                  displayMode="grid"
                  limit={12}
                  showEngineInfo={true}
                  showSettings={true}
                />

                {/* Popular Searches */}
                <div className="bg-white rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Popular Searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['luxury handbags', 'designer shoes', 'premium skincare', 'silk scarves', 'watches', 'jewelry'].map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSearch(search)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}