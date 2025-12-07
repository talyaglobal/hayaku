'use client'

import { useState } from 'react'
import { Eye, Clock, X, ChevronLeft, ChevronRight, BarChart3, Trash2 } from 'lucide-react'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { Product } from '@/types'

interface RecentlyViewedProps {
  onProductClick?: (product: Product) => void
  displayMode?: 'horizontal' | 'grid' | 'list'
  maxItems?: number
  showAnalytics?: boolean
  showClearOption?: boolean
  title?: string
  className?: string
}

export default function RecentlyViewed({
  onProductClick,
  displayMode = 'horizontal',
  maxItems = 10,
  showAnalytics = false,
  showClearOption = true,
  title = 'Recently Viewed',
  className = '',
}: RecentlyViewedProps) {
  const {
    recentlyViewed,
    isLoading,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    getViewingAnalytics,
  } = useRecentlyViewed()

  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-48 h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const products = getRecentlyViewed(maxItems)
  const analytics = getViewingAnalytics()

  if (products.length === 0) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <Eye className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500">Products you view will appear here</p>
      </div>
    )
  }

  const handleProductClick = (product: Product) => {
    onProductClick?.(product)
  }

  const handleRemoveProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    removeFromRecentlyViewed(productId)
  }

  const handleClearAll = () => {
    if (confirm('Clear all recently viewed products?')) {
      clearRecentlyViewed()
    }
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  const formatViewedAt = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Just now'
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + 1 >= Math.ceil(products.length / 4) ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev - 1 < 0 ? Math.ceil(products.length / 4) - 1 : prev - 1
    )
  }

  const ProductCard = ({ product, item, compact = false }: { product: Product, item: any, compact?: boolean }) => (
    <div
      className={`group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
        compact ? 'p-3' : 'p-4'
      }`}
      onClick={() => handleProductClick(product)}
    >
      <div className="relative">
        <img
          src={product.product_images?.[0]?.url || '/api/placeholder/200/200'}
          alt={product.name}
          className={`w-full object-cover rounded ${compact ? 'h-32' : 'h-48'}`}
        />
        <button
          onClick={(e) => handleRemoveProduct(e, product.id)}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <X className="h-3 w-3 text-gray-500 hover:text-red-500" />
        </button>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          <Clock className="h-3 w-3 inline mr-1" />
          {formatViewedAt(item.viewedAt)}
        </div>
      </div>
      
      <div className={`${compact ? 'mt-2' : 'mt-4'}`}>
        <h3 className={`font-medium text-gray-900 truncate ${compact ? 'text-sm' : ''}`}>
          {product.name}
        </h3>
        {product.brands && (
          <p className={`text-gray-500 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {product.brands.name}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className={`font-bold text-gray-900 ${compact ? 'text-sm' : ''}`}>
            {formatPrice(product.price, product.currency)}
          </span>
          {item.viewCount > 1 && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Viewed {item.viewCount}x
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">({products.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          {showAnalytics && (
            <button
              onClick={() => setShowAnalyticsPanel(!showAnalyticsPanel)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="View Analytics"
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          )}
          {showClearOption && products.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600 px-3 py-1 rounded hover:bg-red-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Analytics Panel */}
      {showAnalyticsPanel && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Viewing Analytics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalViews}</div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.uniqueProducts}</div>
              <div className="text-xs text-gray-600">Unique Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.categoriesViewed}</div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.brandsViewed}</div>
              <div className="text-xs text-gray-600">Brands</div>
            </div>
          </div>
          {analytics.mostViewed && (
            <div className="text-sm text-gray-600">
              Most viewed: <span className="font-medium">{analytics.mostViewed.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Products Display */}
      {displayMode === 'horizontal' && (
        <div className="relative">
          {products.length > 4 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-4"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product, index) => {
                const item = recentlyViewed.find(item => item.product.id === product.id)
                if (!item) return null
                
                return (
                  <div key={product.id} className="flex-shrink-0 w-64">
                    <ProductCard product={product} item={item} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {displayMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => {
            const item = recentlyViewed.find(item => item.product.id === product.id)
            if (!item) return null
            
            return (
              <ProductCard key={product.id} product={product} item={item} compact />
            )
          })}
        </div>
      )}

      {displayMode === 'list' && (
        <div className="space-y-3">
          {products.map((product) => {
            const item = recentlyViewed.find(item => item.product.id === product.id)
            if (!item) return null
            
            return (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleProductClick(product)}
              >
                <img
                  src={product.product_images?.[0]?.url || '/api/placeholder/80/80'}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  {product.brands && (
                    <p className="text-sm text-gray-500">{product.brands.name}</p>
                  )}
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-bold text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatViewedAt(item.viewedAt)}
                    </span>
                    {item.viewCount > 1 && (
                      <span className="text-xs text-gray-500">
                        Viewed {item.viewCount} times
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemoveProduct(e, product.id)}
                  className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination dots for horizontal mode */}
      {displayMode === 'horizontal' && products.length > 4 && (
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: Math.ceil(products.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}