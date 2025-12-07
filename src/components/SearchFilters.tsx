'use client'

import { useState, useEffect } from 'react'
import { FilterState } from '@/types'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch: (query: string) => void
  brands?: string[]
  categories?: string[]
  totalResults?: number
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  brands = [],
  categories = [],
  totalResults = 0,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handleArrayFilterChange = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    onFiltersChange({
      ...filters,
      [key]: updatedArray,
    })
  }

  const handlePriceRangeChange = (index: 0 | 1, value: number) => {
    const currentRange = Array.isArray(filters.priceRange) ? filters.priceRange : [filters.priceRange?.min || 0, filters.priceRange?.max || 10000]
    const newRange: [number, number] = [...currentRange] as [number, number]
    newRange[index] = value
    handleFilterChange('priceRange', newRange)
  }

  const clearAllFilters = () => {
    onFiltersChange({
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
    setSearchQuery('')
    onSearch('')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if ((filters.brands?.length || 0) > 0) count++
    if ((filters.categories?.length || 0) > 0) count++
    if ((filters.priceRange?.[0] || 0) > 0 || (filters.priceRange?.[1] || 10000) < 10000) count++
    if ((filters.sizes?.length || 0) > 0) count++
    if ((filters.colors?.length || 0) > 0) count++
    if ((filters.materials?.length || 0) > 0) count++
    if (filters.inStock) count++
    if (filters.isNew) count++
    if (filters.isLimitedEdition) count++
    return count
  }

  const activeFiltersCount = getActiveFilterCount()

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  const availableColors = ['Black', 'White', 'Navy', 'Beige', 'Brown', 'Red', 'Pink', 'Green', 'Blue', 'Gold', 'Silver']
  const availableMaterials = ['Cotton', 'Silk', 'Wool', 'Cashmere', 'Leather', 'Linen', 'Polyester', 'Viscose']

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products, brands, or categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Toggle & Results */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {totalResults} products found
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-lg">
            {/* Brands */}
            <div>
              <h3 className="font-medium mb-3">Brands</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.brands?.includes(brand) || false}
                      onChange={() => handleArrayFilterChange('brands', brand)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category) || false}
                      onChange={() => handleArrayFilterChange('categories', category)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange?.[0] || 0}
                    onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange?.[1] || 10000}
                    onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={filters.priceRange?.[1] || 10000}
                  onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-3">Sizes</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleArrayFilterChange('sizes', size)}
                    className={`px-2 py-1 text-xs rounded border ${
                      filters.sizes?.includes(size) || false
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-3">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleArrayFilterChange('colors', color)}
                    className={`px-3 py-1 text-xs rounded-full border ${
                      filters.colors?.includes(color) || false
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h3 className="font-medium mb-3">Materials</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableMaterials.map((material) => (
                  <label key={material} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.materials?.includes(material) || false}
                      onChange={() => handleArrayFilterChange('materials', material)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div>
              <h3 className="font-medium mb-3">Special</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">New Arrivals</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.isLimitedEdition}
                    onChange={(e) => handleFilterChange('isLimitedEdition', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Limited Edition</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}