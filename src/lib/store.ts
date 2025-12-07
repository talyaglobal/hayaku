import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, FilterState } from '@/types'

interface StoreState {
  // Cart State
  cart: CartItem[]
  isCartOpen: boolean
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // UI State
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  
  // Filters State
  filters: FilterState
  updateFilters: (newFilters: Partial<FilterState>) => void
  clearFilters: () => void
  
  // Computed
  cartTotal: number
  cartCount: number
}

const defaultFilters: FilterState = {
  brands: [],
  categories: [],
  priceRange: [0, 10000],
  sizes: [],
  colors: [],
  materials: [],
  inStock: false,
  isNew: false,
  isLimitedEdition: false,
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart State
      cart: [],
      isCartOpen: false,
      
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find(
          (cartItem) => 
            cartItem.productId === item.productId && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        )
        
        if (existingItem) {
          return {
            cart: state.cart.map((cartItem) =>
              cartItem.id === existingItem.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          }
        }
        
        return {
          cart: [...state.cart, { ...item, quantity: 1 }]
        }
      }),
      
      removeFromCart: (productId, size, color) => set((state) => ({
        cart: state.cart.filter(
          (item) => !(item.productId === productId && item.size === size && item.color === color)
        )
      })),
      
      updateQuantity: (productId, size, color, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.productId === productId && item.size === size && item.color === color
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),
      
      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      // UI State
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      
      // Filters State
      filters: defaultFilters,
      updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      clearFilters: () => set({ filters: defaultFilters }),
      
      // Computed getters
      get cartTotal() {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      get cartCount() {
        return get().cart.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'hayaku-store',
      partialize: (state) => ({ 
        cart: state.cart,
        filters: state.filters 
      }),
    }
  )
)