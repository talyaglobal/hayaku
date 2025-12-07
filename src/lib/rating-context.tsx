'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface RatingContextType {
  ratings: { [productId: string]: number }
  setRating: (productId: string, rating: number) => void
  getRating: (productId: string) => number
}

const RatingContext = createContext<RatingContextType | undefined>(undefined)

export function RatingProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<{ [productId: string]: number }>({})

  const setRating = (productId: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [productId]: rating
    }))
  }

  const getRating = (productId: string) => {
    return ratings[productId] || 0
  }

  return (
    <RatingContext.Provider value={{ ratings, setRating, getRating }}>
      {children}
    </RatingContext.Provider>
  )
}

export function useRating() {
  const context = useContext(RatingContext)
  if (context === undefined) {
    throw new Error('useRating must be used within a RatingProvider')
  }
  return context
}