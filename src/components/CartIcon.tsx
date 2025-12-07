'use client'

import { useCartStore } from '@/lib/cart-store'
import { ShoppingBag } from 'lucide-react'

export default function CartIcon() {
  const { getItemCount, toggleCart } = useCartStore()
  const itemCount = getItemCount()

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 hover:text-indigo-600"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}