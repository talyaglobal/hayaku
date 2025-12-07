'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Star, Clock, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRecommendations, ProductRecommendation, RecommendationEngine } from '@/hooks/useRecommendations'
import { Product } from '@/types'

interface ProductRecommendationsProps {
  allProducts?: Product[]
  onProductClick?: (product: Product) => void
  title?: string
  subtitle?: string
  limit?: number
  engines?: RecommendationEngine['type'][]
  displayMode?: 'grid' | 'horizontal' | 'list'
  showEngineInfo?: boolean
  showSettings?: boolean
  className?: string
}

export default function ProductRecommendations({
  allProducts = [],
  onProductClick,
  title = 'Recommended for You',
  subtitle = 'Personalized picks based on your activity',
  limit = 12,
  engines,
  displayMode = 'grid',
  showEngineInfo = false,
  showSettings = false,
  className = '',
}: ProductRecommendationsProps) {
  const {
    getPersonalizedRecommendations,
    getRecommendations,
    engines: recommendationEngines,
    updateEngine,
    userPreferences,
    isLoading,
  } = useRecommendations(allProducts)

  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showEngineSettings, setShowEngineSettings] = useState(false)

  // Load recommendations on mount and when dependencies change
  useEffect(() => {
    loadRecommendations()
  }, [allProducts, engines, limit])

  const loadRecommendations = async () => {
    try {
      const results = engines 
        ? await getRecommendations({ engines, limit, excludeViewed: true })
        : await getPersonalizedRecommendations(limit)
      
      setRecommendations(results)
    } catch (error) {
      console.error('Error loading recommendations:', error)
      setRecommendations([])
    }
  }

  const handleProductClick = (product: Product) => {
    onProductClick?.(product)
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price)
  }

  const getEngineIcon = (engineType: RecommendationEngine['type']) => {
    switch (engineType) {
      case 'trending':
        return <TrendingUp className="h-4 w-4" />
      case 'similar':
      case 'content_based':
        return <Star className="h-4 w-4" />
      case 'collaborative':
        return <Sparkles className="h-4 w-4" />
      case 'featured':
        return <Star className="h-4 w-4" />
      case 'new_arrivals':
        return <Clock className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getEngineColor = (engineType: RecommendationEngine['type']) => {
    switch (engineType) {
      case 'trending':
        return 'text-orange-600 bg-orange-50'
      case 'similar':
        return 'text-blue-600 bg-blue-50'
      case 'collaborative':
        return 'text-purple-600 bg-purple-50'
      case 'content_based':
        return 'text-green-600 bg-green-50'
      case 'featured':
        return 'text-yellow-600 bg-yellow-50'
      case 'new_arrivals':
        return 'text-pink-600 bg-pink-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const nextSlide = () => {
    const itemsPerSlide = displayMode === 'horizontal' ? 4 : 1
    setCurrentIndex(prev => 
      prev + itemsPerSlide >= recommendations.length ? 0 : prev + itemsPerSlide
    )
  }

  const prevSlide = () => {
    const itemsPerSlide = displayMode === 'horizontal' ? 4 : 1
    setCurrentIndex(prev => 
      prev - itemsPerSlide < 0 ? Math.max(0, recommendations.length - itemsPerSlide) : prev - itemsPerSlide
    )
  }

  const ProductCard = ({ recommendation, compact = false }: { recommendation: ProductRecommendation, compact?: boolean }) => {
    const { product } = recommendation
    
    return (
      <div
        className={`group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
          compact ? 'p-3' : 'p-4'
        }`}
        onClick={() => handleProductClick(product)}
      >
        <div className="relative">
          <img
            src={product.product_images?.[0]?.url || '/api/placeholder/250/250'}
            alt={product.name}
            className={`w-full object-cover rounded ${compact ? 'h-40' : 'h-48'}`}
          />
          
          {/* Engine badge */}
          {showEngineInfo && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full flex items-center gap-1 ${getEngineColor(recommendation.engine)}`}>
              {getEngineIcon(recommendation.engine)}
              <span className="text-xs font-medium capitalize">
                {recommendation.engine.replace('_', ' ')}
              </span>
            </div>
          )}
          
          {/* Score badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {Math.round(recommendation.score)}%
          </div>
          
          {/* Discount badge */}
          {product.compare_price && product.compare_price > product.price && (
            <div className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
            </div>
          )}
        </div>
        
        <div className={`${compact ? 'mt-2' : 'mt-4'}`}>
          <h3 className={`font-medium text-gray-900 line-clamp-2 ${compact ? 'text-sm' : ''}`}>
            {product.name}
          </h3>
          
          {product.brands && (
            <p className={`text-gray-500 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
              {product.brands.name}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-gray-900 ${compact ? 'text-sm' : ''}`}>
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.compare_price, product.currency)}
                </span>
              )}
            </div>
          </div>
          
          {/* Recommendation reasons */}
          {recommendation.reasons.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 line-clamp-2">
                {recommendation.reasons.slice(0, 2).join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className={`p-6 text-center ${className}`}>
        <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500">
          {userPreferences.viewCount === 0 
            ? 'Browse some products to get personalized recommendations'
            : 'No recommendations available at the moment'
          }
        </p>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {showSettings && (
            <button
              onClick={() => setShowEngineSettings(!showEngineSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Recommendation Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={loadRecommendations}
            className="text-sm text-blue-500 hover:text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
            disabled={isLoading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Engine Settings Panel */}
      {showEngineSettings && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Recommendation Engines</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {recommendationEngines.map(engine => (
              <div key={engine.type} className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <div className="flex items-center gap-2">
                    {getEngineIcon(engine.type)}
                    <span className="text-sm font-medium capitalize">
                      {engine.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Weight: {Math.round(engine.weight * 100)}%
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={engine.enabled}
                    onChange={(e) => updateEngine(engine.type, { enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Display */}
      {displayMode === 'horizontal' && (
        <div className="relative">
          {recommendations.length > 4 && (
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
              style={{ transform: `translateX(-${currentIndex * 25}%)` }}
            >
              {recommendations.map((recommendation) => (
                <div key={recommendation.product.id} className="flex-shrink-0 w-1/4 min-w-[250px]">
                  <ProductCard recommendation={recommendation} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {displayMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recommendations.map((recommendation) => (
            <ProductCard 
              key={recommendation.product.id} 
              recommendation={recommendation} 
              compact 
            />
          ))}
        </div>
      )}

      {displayMode === 'list' && (
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.product.id}
              className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProductClick(recommendation.product)}
            >
              <img
                src={recommendation.product.product_images?.[0]?.url || '/api/placeholder/80/80'}
                alt={recommendation.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-grow">
                    <h3 className="font-medium text-gray-900 truncate">
                      {recommendation.product.name}
                    </h3>
                    {recommendation.product.brands && (
                      <p className="text-sm text-gray-500">
                        {recommendation.product.brands.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-gray-900">
                        {formatPrice(recommendation.product.price, recommendation.product.currency)}
                      </span>
                      {showEngineInfo && (
                        <span className={`text-xs px-2 py-1 rounded-full ${getEngineColor(recommendation.engine)}`}>
                          {recommendation.engine}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <div className="font-medium">{Math.round(recommendation.score)}% match</div>
                    {recommendation.reasons.length > 0 && (
                      <div className="text-xs mt-1 max-w-40">
                        {recommendation.reasons[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination dots for horizontal mode */}
      {displayMode === 'horizontal' && recommendations.length > 4 && (
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: Math.ceil(recommendations.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 4)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 4) === index ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}