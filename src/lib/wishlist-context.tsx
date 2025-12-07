'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  brand: string
  slug: string
}

interface WishlistContextType {
  wishlist: WishlistItem[]
  isInWishlist: (productId: string) => boolean
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (item: WishlistItem) => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('hayaku-wishlist')
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hayaku-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId)
  }

  const addToWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev // Item already in wishlist
      }
      return [...prev, item]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId))
  }

  const toggleWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist(item)
    }
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{
      wishlist,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}