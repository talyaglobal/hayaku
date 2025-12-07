'use client'

import { useState } from 'react'
import { Clock, Search, Trash2, TrendingUp, BarChart3, Calendar, X } from 'lucide-react'
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory'

interface SearchHistoryProps {
  onSearchSelect: (query: string) => void
  onClose?: () => void
  maxVisible?: number
}

export default function SearchHistory({ 
  onSearchSelect, 
  onClose,
  maxVisible = 10 
}: SearchHistoryProps) {
  const {
    searchHistory,
    isLoading,
    removeFromHistory,
    clearHistory,
    getRecentSearches,
    getPopularSearches,
    getSearchesByDate,
    getSearchAnalytics,
  } = useSearchHistory()

  const [view, setView] = useState<'recent' | 'popular' | 'analytics'>('recent')
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all')

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <span className="mt-2 text-sm text-gray-500">Loading search history...</span>
      </div>
    )
  }

  const filteredHistory = timeFilter === 'all' 
    ? searchHistory 
    : getSearchesByDate(timeFilter === '7d' ? 7 : 30)

  const analytics = getSearchAnalytics()
  const recentSearches = getRecentSearches(maxVisible)
  const popularSearches = getPopularSearches(maxVisible)

  const formatDate = (timestamp: number) => {
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

  const handleSearchClick = (query: string) => {
    onSearchSelect(query)
    onClose?.()
  }

  const handleRemoveClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeFromHistory(id)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all search history?')) {
      clearHistory()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <h2 className="font-medium text-gray-900">Search History</h2>
        </div>
        <div className="flex items-center gap-2">
          {searchHistory.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600 px-2 py-1 rounded"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setView('recent')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            view === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock className="h-4 w-4 inline mr-2" />
          Recent
        </button>
        <button
          onClick={() => setView('popular')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            view === 'popular'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Popular
        </button>
        <button
          onClick={() => setView('analytics')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            view === 'analytics'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Time Filter for Recent View */}
      {view === 'recent' && searchHistory.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All time' },
              { key: '7d', label: 'Last 7 days' },
              { key: '30d', label: 'Last 30 days' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeFilter(key as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  timeFilter === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto">
        {/* Recent Searches */}
        {view === 'recent' && (
          <>
            {filteredHistory.length > 0 ? (
              <div className="p-2">
                {filteredHistory.slice(0, maxVisible).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group cursor-pointer"
                    onClick={() => handleSearchClick(item.query)}
                  >
                    <div className="flex items-center gap-3 flex-grow min-w-0">
                      <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-grow">
                        <div className="font-medium text-gray-900 truncate">{item.query}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                          {item.resultCount !== undefined && (
                            <>
                              <span>•</span>
                              <span>{item.resultCount} results</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleRemoveClick(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No searches found</p>
                <p className="text-xs mt-1">
                  {timeFilter === 'all' 
                    ? 'Your search history will appear here' 
                    : 'No searches in the selected time period'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Popular Searches */}
        {view === 'popular' && (
          <>
            {popularSearches.length > 0 ? (
              <div className="p-2">
                {popularSearches.map((query, index) => (
                  <div
                    key={query}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleSearchClick(query)}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900">{query}</div>
                      <div className="text-xs text-gray-500">Popular search</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <TrendingUp className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No popular searches yet</p>
                <p className="text-xs mt-1">Search more to see trends</p>
              </div>
            )}
          </>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="p-4 space-y-6">
            {analytics.totalSearches > 0 ? (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.totalSearches}
                    </div>
                    <div className="text-sm text-blue-700">Total Searches</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.uniqueQueries}
                    </div>
                    <div className="text-sm text-green-700">Unique Queries</div>
                  </div>
                </div>

                {/* Top Searches */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Top Search Terms</h3>
                  <div className="space-y-2">
                    {analytics.popularQueries.slice(0, 5).map((query, index) => (
                      <div
                        key={query}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSearchClick(query)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            #{index + 1}
                          </span>
                          <span className="text-sm text-gray-900">{query}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Recent Activity</h3>
                  <div className="text-sm text-gray-600">
                    Last search: {analytics.recentSearches[0] ? formatDate(analytics.recentSearches[0].timestamp) : 'Never'}
                  </div>
                  {analytics.averageResultCount > 0 && (
                    <div className="text-sm text-gray-600 mt-1">
                      Average results: {analytics.averageResultCount} per search
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No analytics available</p>
                <p className="text-xs mt-1">Start searching to see analytics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}