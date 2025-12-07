'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useStore } from '@/lib/store'

export default function ShoppingCart() {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    cartCount 
  } = useStore()
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={toggleCart}
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="font-luxury-serif text-xl font-bold">
                    Alışveriş Çantası ({cartCount})
                  </h2>
                </div>
                <button
                  onClick={toggleCart}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Çantanız boş</h3>
                    <p className="text-gray-500 mb-6">Başlamak için lüks parçalar ekleyin</p>
                    <button 
                      onClick={toggleCart}
                      className="luxury-button"
                    >
                      Alışverişe Devam Et
                    </button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex space-x-4 pb-6 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-20 h-24 relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              {item.brand}
                            </p>
                            <h3 className="font-medium text-sm text-gray-900">
                              {item.name}
                            </h3>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <p>Size: {item.size}</p>
                            <p>Color: {item.color}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-sm">
                                ${(item.price * item.quantity).toLocaleString()}
                              </p>
                              <button
                                onClick={() => removeFromCart(item.productId, item.size, item.color)}
                                className="text-xs text-red-500 hover:text-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-luxury-serif text-lg font-bold">Total</span>
                    <span className="font-luxury-serif text-xl font-bold">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.href = '/checkout'}
                      className="w-full luxury-button py-4"
                    >
                      Güvenli Ödeme
                    </button>
                    <button 
                      onClick={clearCart}
                      className="w-full luxury-button-outline py-3 text-sm"
                    >
                      Clear Bag
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Free shipping on orders over $500
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}