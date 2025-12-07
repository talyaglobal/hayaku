# Component Documentation

## Overview
This document provides comprehensive documentation for all React components in the Hayaku luxury e-commerce application. Components are organized by category and include props, usage examples, and implementation details.

---

## Table of Contents
1. [Authentication Components](#authentication-components)
2. [Search Components](#search-components)
3. [Layout Components](#layout-components)
4. [Usage Guidelines](#usage-guidelines)

---

## Authentication Components

### AuthProvider
Context provider for managing authentication state throughout the application.

**File**: `src/components/AuthProvider.tsx`

**Props**: 
```typescript
interface AuthProviderProps {
  children: React.ReactNode
}
```

**Context Type**:
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}
```

**Usage**:
```tsx
import { AuthProvider, useAuth } from '@/components/AuthProvider'

// Wrap your app
function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  )
}

// Use in components
function UserProfile() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

**Features**:
- Provides global authentication state
- Handles loading states
- Manages sign-out functionality
- Throws error if used outside provider

---

## Search Components

### SearchAutocomplete
Advanced search input with autocomplete suggestions, recent searches, and trending items.

**File**: `src/components/SearchAutocomplete.tsx`

**Props**:
```typescript
interface SearchAutocompleteProps {
  onSelect: (suggestion: SearchSuggestion) => void
  onSearch: (query: string) => void
  placeholder?: string
  recentSearches?: string[]
  onClearRecentSearches?: () => void
}

interface SearchSuggestion {
  type: 'product' | 'brand' | 'category' | 'query'
  id?: string
  title: string
  subtitle?: string
  image?: string
  popularity?: number
}
```

**Usage**:
```tsx
import SearchAutocomplete from '@/components/SearchAutocomplete'

function SearchPage() {
  const [recentSearches, setRecentSearches] = useState(['luxury bags', 'designer shoes'])

  const handleSelect = (suggestion: SearchSuggestion) => {
    console.log('Selected:', suggestion)
    // Navigate to results or product page
  }

  const handleSearch = (query: string) => {
    console.log('Searching for:', query)
    // Perform search logic
  }

  const clearRecent = () => {
    setRecentSearches([])
  }

  return (
    <SearchAutocomplete
      onSelect={handleSelect}
      onSearch={handleSearch}
      placeholder="Search products, brands..."
      recentSearches={recentSearches}
      onClearRecentSearches={clearRecent}
    />
  )
}
```

**Features**:
- Debounced search (300ms)
- Keyboard navigation (arrow keys, enter, escape)
- Recent searches display
- Trending products
- Popular searches
- Mock API integration ready
- Loading states
- No results handling
- Click-outside to close

**States**:
- Empty state: Shows recent searches, trending, and popular
- Loading state: Shows spinner during search
- Results state: Shows filtered suggestions
- No results state: Shows helpful message

---

### SearchFilters
Comprehensive filtering component for product search with multiple filter types.

**File**: `src/components/SearchFilters.tsx`

**Props**:
```typescript
interface SearchFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onSearch: (query: string) => void
  brands?: string[]
  categories?: string[]
  totalResults?: number
}

interface FilterState {
  brands: string[]
  categories: string[]
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isLimitedEdition: boolean
}
```

**Usage**:
```tsx
import SearchFilters from '@/components/SearchFilters'
import { FilterState } from '@/types'

function ProductsPage() {
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

  const brands = ['Prada', 'Gucci', 'Hermès']
  const categories = ['Handbags', 'Shoes', 'Accessories']

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Apply filters to your products
  }

  const handleSearch = (query: string) => {
    // Handle search query
  }

  return (
    <SearchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      brands={brands}
      categories={categories}
      totalResults={120}
    />
  )
}
```

**Features**:
- Search input with icon
- Collapsible filter panel
- Multiple filter types:
  - Brands (checkbox)
  - Categories (checkbox)
  - Price range (input + slider)
  - Sizes (button grid)
  - Colors (rounded buttons)
  - Materials (checkbox)
  - Special filters (boolean toggles)
- Active filter count badge
- Clear all filters functionality
- Results counter
- Responsive grid layout

**Filter Types**:
- **Brands**: Multi-select checkboxes with scrollable list
- **Categories**: Multi-select checkboxes with scrollable list
- **Price Range**: Number inputs + range slider (0-10000)
- **Sizes**: Button grid (XS, S, M, L, XL, XXL, One Size)
- **Colors**: Rounded buttons (Black, White, Navy, etc.)
- **Materials**: Checkboxes (Cotton, Silk, Wool, etc.)
- **Special**: Boolean toggles (In Stock, New Arrivals, Limited Edition)

---

### SearchHistory
Advanced search history management with analytics and different view modes.

**File**: `src/components/SearchHistory.tsx`

**Props**:
```typescript
interface SearchHistoryProps {
  onSearchSelect: (query: string) => void
  onClose?: () => void
  maxVisible?: number
}
```

**Dependencies**:
```typescript
// Requires custom hook
import { useSearchHistory, SearchHistoryItem } from '@/hooks/useSearchHistory'

interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultCount?: number
}
```

**Usage**:
```tsx
import SearchHistory from '@/components/SearchHistory'

function SearchModal() {
  const [showHistory, setShowHistory] = useState(false)

  const handleSearchSelect = (query: string) => {
    console.log('Selected from history:', query)
    // Perform search
    setShowHistory(false)
  }

  return (
    <div>
      <button onClick={() => setShowHistory(true)}>
        Show Search History
      </button>
      
      {showHistory && (
        <SearchHistory
          onSearchSelect={handleSearchSelect}
          onClose={() => setShowHistory(false)}
          maxVisible={10}
        />
      )}
    </div>
  )
}
```

**Features**:
- Three view modes: Recent, Popular, Analytics
- Time filtering (All, 7 days, 30 days)
- Individual item removal
- Clear all history
- Real-time timestamps
- Search analytics dashboard
- Responsive design

**View Modes**:

1. **Recent View**:
   - Chronological list of searches
   - Time filters
   - Individual delete buttons
   - Result count display
   - Relative timestamps

2. **Popular View**:
   - Ranked list of frequent searches
   - Trending indicators
   - Popularity rankings

3. **Analytics View**:
   - Total searches count
   - Unique queries count
   - Top search terms
   - Recent activity summary
   - Average result counts

**Required Hook Implementation**:
```typescript
// @/hooks/useSearchHistory.ts
export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: number
  resultCount?: number
}

export function useSearchHistory() {
  return {
    searchHistory: SearchHistoryItem[]
    isLoading: boolean
    removeFromHistory: (id: string) => void
    clearHistory: () => void
    getRecentSearches: (limit: number) => string[]
    getPopularSearches: (limit: number) => string[]
    getSearchesByDate: (days: number) => SearchHistoryItem[]
    getSearchAnalytics: () => {
      totalSearches: number
      uniqueQueries: number
      popularQueries: string[]
      recentSearches: SearchHistoryItem[]
      averageResultCount: number
    }
  }
}
```

---

## Layout Components

### RootLayout
Main layout component that wraps the entire application.

**File**: `src/app/layout.tsx`

**Props**:
```typescript
interface RootLayoutProps {
  children: React.ReactNode
}
```

**Features**:
- Next.js metadata configuration
- Inter font integration
- Global CSS imports
- HTML structure setup

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: 'Hayaku - Luxury E-commerce',
  description: 'Premium luxury fashion and lifestyle products',
}
```

**Usage**:
This component is automatically used by Next.js as the root layout. No manual implementation needed.

---

## Usage Guidelines

### 1. Component Organization
```
src/components/
├── AuthProvider.tsx          # Authentication context
├── SearchAutocomplete.tsx    # Advanced search input
├── SearchFilters.tsx         # Product filtering
└── SearchHistory.tsx         # Search history management
```

### 2. Import Patterns
```tsx
// Named exports
import { AuthProvider, useAuth } from '@/components/AuthProvider'

// Default exports
import SearchAutocomplete from '@/components/SearchAutocomplete'
import SearchFilters from '@/components/SearchFilters'
import SearchHistory from '@/components/SearchHistory'
```

### 3. Type Definitions
Create a central types file for shared interfaces:

```typescript
// @/types/index.ts
export interface FilterState {
  brands: string[]
  categories: string[]
  priceRange: [number, number]
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isNew: boolean
  isLimitedEdition: boolean
}

export interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
}

export interface Brand {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
}
```

### 4. Styling Guidelines
- Use Tailwind CSS classes
- Follow responsive design patterns
- Implement hover states
- Use semantic colors
- Maintain consistent spacing

### 5. State Management
- Use React hooks for local state
- Implement proper prop drilling
- Consider context for global state
- Handle loading and error states

### 6. Accessibility
- Include proper ARIA labels
- Implement keyboard navigation
- Use semantic HTML elements
- Provide focus management
- Support screen readers

### 7. Performance
- Implement debouncing for search
- Use proper React keys
- Optimize re-renders with useMemo/useCallback
- Handle large lists with virtualization

### 8. Testing Considerations
- Mock external dependencies
- Test user interactions
- Verify keyboard navigation
- Test error states
- Check responsive behavior

---

## Implementation Notes

### Required Dependencies
```json
{
  "dependencies": {
    "lucide-react": "^0.344.0",
    "@supabase/supabase-js": "^2.58.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### Custom Hooks Needed
1. `useAuth` / `useAuthState` - Authentication management
2. `useSearchHistory` - Search history functionality
3. Custom debouncing hooks for search

### API Integration
Components are designed to work with the documented API endpoints:
- `/api/search` - Search functionality
- `/api/products` - Product filtering
- `/api/brands` - Brand data
- `/api/categories` - Category data

### Future Enhancements
1. Add more filter types (ratings, discounts)
2. Implement voice search
3. Add search result highlighting
4. Support for saved searches
5. Advanced analytics dashboard
6. Mobile-specific optimizations
7. Internationalization support
8. Dark mode support

This documentation serves as a comprehensive guide for understanding, using, and extending the component library in the Hayaku e-commerce application.