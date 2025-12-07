'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Clock, TrendingUp, X } from 'lucide-react'
import { Product, Brand, Category } from '@/types'

interface SearchSuggestion {
  type: 'product' | 'brand' | 'category' | 'query'
  id?: string
  title: string
  subtitle?: string
  image?: string
  popularity?: number
}

interface SearchAutocompleteProps {
  onSelect: (suggestion: SearchSuggestion) => void
  onSearch: (query: string) => void
  placeholder?: string
  recentSearches?: string[]
  onClearRecentSearches?: () => void
}

export default function SearchAutocomplete({
  onSelect,
  onSearch,
  placeholder = "Search products, brands, or categories...",
  recentSearches = [],
  onClearRecentSearches,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mock popular searches and trending items
  const popularSearches = [
    'luxury handbags',
    'designer shoes',
    'premium skincare',
    'cashmere sweaters',
    'silk scarves'
  ]

  const trendingProducts = [
    { id: '1', title: 'Hermès Birkin Bag', subtitle: 'Luxury Handbags', image: '/api/placeholder/40/40' },
    { id: '2', title: 'Chanel No. 5', subtitle: 'Fragrances', image: '/api/placeholder/40/40' },
    { id: '3', title: 'Rolex Submariner', subtitle: 'Watches', image: '/api/placeholder/40/40' },
  ]

  // Debounced search function
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        // Simulate API call
        const mockSuggestions = await fetchSuggestions(query)
        setSuggestions(mockSuggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Mock API function to fetch suggestions
  const fetchSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const suggestions: SearchSuggestion[] = []
    const lowerQuery = searchQuery.toLowerCase()

    // Mock product suggestions
    const mockProducts = [
      { id: '1', name: 'Luxury Handbag Collection', brand: 'Hermès', image: '/api/placeholder/40/40' },
      { id: '2', name: 'Designer Sunglasses', brand: 'Chanel', image: '/api/placeholder/40/40' },
      { id: '3', name: 'Premium Skincare Set', brand: 'La Prairie', image: '/api/placeholder/40/40' },
    ]

    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery) || product.brand.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'product',
          id: product.id,
          title: product.name,
          subtitle: `by ${product.brand}`,
          image: product.image,
        })
      }
    })

    // Mock brand suggestions
    const mockBrands = ['Hermès', 'Chanel', 'Louis Vuitton', 'Gucci', 'Prada']
    mockBrands.forEach(brand => {
      if (brand.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'brand',
          title: brand,
          subtitle: 'Brand',
        })
      }
    })

    // Mock category suggestions
    const mockCategories = ['Handbags', 'Sunglasses', 'Skincare', 'Fragrances', 'Watches']
    mockCategories.forEach(category => {
      if (category.toLowerCase().includes(lowerQuery)) {
        suggestions.push({
          type: 'category',
          title: category,
          subtitle: 'Category',
        })
      }
    })

    // Add query suggestion
    suggestions.push({
      type: 'query',
      title: `Search for "${searchQuery}"`,
      subtitle: 'Press Enter to search',
    })

    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setSelectedIndex(-1)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < getSuggestionsToShow().length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : getSuggestionsToShow().length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        const suggestionsToShow = getSuggestionsToShow()
        if (selectedIndex >= 0 && selectedIndex < suggestionsToShow.length) {
          handleSuggestionClick(suggestionsToShow[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect(suggestion)
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    setIsOpen(false)
    onSearch(search)
  }

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false)
      onSearch(query)
    }
  }

  const getSuggestionsToShow = () => {
    if (query.trim()) {
      return suggestions
    }
    
    // Show recent searches and trending when no query
    const recentSuggestions = recentSearches.map(search => ({
      type: 'query' as const,
      title: search,
      subtitle: 'Recent search',
    }))

    const trendingSuggestions = trendingProducts.map(product => ({
      type: 'product' as const,
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      image: product.image,
    }))

    return [...recentSuggestions, ...trendingSuggestions].slice(0, 8)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestionsToShow = getSuggestionsToShow()

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <span className="mt-2 text-sm">Searching...</span>
            </div>
          )}

          {/* No query state - show recent searches and trending */}
          {!query.trim() && !isLoading && (
            <>
              {recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </h3>
                    {onClearRecentSearches && (
                      <button
                        onClick={onClearRecentSearches}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {trendingProducts.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending Now
                  </h3>
                  <div className="space-y-2">
                    {trendingProducts.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick({
                          type: 'product',
                          id: product.id,
                          title: product.title,
                          subtitle: product.subtitle,
                          image: product.image,
                        })}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{product.title}</div>
                          <div className="text-xs text-gray-500">{product.subtitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {popularSearches.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Search results */}
          {query.trim() && !isLoading && suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id || index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  {suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {suggestion.type === 'product' && <Search className="h-4 w-4 text-gray-400" />}
                      {suggestion.type === 'brand' && <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">{suggestion.title.charAt(0)}</div>}
                      {suggestion.type === 'category' && <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded text-white text-xs flex items-center justify-center font-bold">{suggestion.title.charAt(0)}</div>}
                      {suggestion.type === 'query' && <Search className="h-4 w-4 text-gray-400" />}
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{suggestion.title}</div>
                    {suggestion.subtitle && (
                      <div className="text-xs text-gray-500 truncate">{suggestion.subtitle}</div>
                    )}
                  </div>
                  {suggestion.type === 'query' && (
                    <div className="text-xs text-gray-400">⏎</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {query.trim() && !isLoading && suggestions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}