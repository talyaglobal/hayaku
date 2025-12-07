'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, Plus, Minus, ShoppingCart, Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { formatPriceWithoutSymbol } from '@/lib/utils'
import { useState } from 'react'
import { useRating } from '@/lib/rating-context'
import { useWishlist } from '@/lib/wishlist-context'

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()
  const { getRating, setRating: setGlobalRating } = useRating()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [hoverRating, setHoverRating] = useState(0)
  
  const rating = getRating(product.id)
  const inWishlist = isInWishlist(product.id)
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product page
    e.stopPropagation()
    
    // Add the specified quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        brand: product.brands?.name || 'Luxury Brand',
        price: product.price,
        image: product.product_images?.[0]?.url || '/placeholder-product.jpg',
        size: 'Standard',
        color: 'Default',
        inStock: true
      })
    }
  }

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleStarClick = (e: React.MouseEvent, starValue: number) => {
    e.preventDefault()
    e.stopPropagation()
    setGlobalRating(product.id, starValue)
  }

  const handleStarHover = (starValue: number) => {
    setHoverRating(starValue)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }
  
  return (
    <Link href={`/products/${product.slug || product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="product-card group"
      >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          {product.product_images?.[0]?.url ? (
            <Image
              src={product.product_images[0].url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-6xl font-luxury-serif text-gray-400">
              {product.name?.charAt(0) || 'P'}
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {product.is_featured && (
            <span className="bg-luxury-gold text-white text-xs font-medium px-3 py-1 rounded-full">
              ÖNE ÇIKAN
            </span>
          )}
          {product.tags?.includes('limited') && (
            <span className="bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              SINIRLI
            </span>
          )}
          {product.compare_price && product.compare_price > product.price && (
            <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              İNDİRİM
            </span>
          )}
        </div>
        
        {/* Hover Actions */}
        <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.product_images?.[0]?.url || '/placeholder-product.jpg',
                brand: product.brands?.name || 'Luxury Brand',
                slug: product.slug || product.id
              })
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md transition-colors ${
              inWishlist 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500' : ''}`} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Quick view functionality here
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
        
      </div>
      
      {/* Product Info */}
      <div className="p-6 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {product.brands?.name || 'Luxury Brand'}
          </p>
          <h3 className="font-medium text-gray-900 hover:text-luxury-gold transition-colors cursor-pointer">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {product.compare_price && product.compare_price > product.price ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPriceWithoutSymbol(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPriceWithoutSymbol(product.compare_price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPriceWithoutSymbol(product.price)} {product.currency || 'TRY'}
            </span>
          )}
        </div>
        
        {/* Star Rating */}
        <div className="flex items-center justify-center space-x-1 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={(e) => handleStarClick(e, star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              className="focus:outline-none transition-colors"
            >
              <Star 
                className={`h-5 w-5 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
        
        {/* Database Hashtags */}
        {product.product_hashtags && product.product_hashtags.length > 0 && (
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {product.product_hashtags.slice(0, 3).map((item: any, index: number) => (
              item.hashtags && item.hashtags.is_active && (
                <span 
                  key={index} 
                  className="text-xs text-white px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: item.hashtags.color }}
                >
                  #{item.hashtags.name}
                </span>
              )
            ))}
          </div>
        )}
        
        {/* Legacy Tags */}
        {(!product.product_hashtags || product.product_hashtags.length === 0) && product.tags && product.tags.length > 0 && (
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {product.country_of_origin && (
          <p className="text-xs text-gray-500">{product.country_of_origin} yapımı</p>
        )}

        {/* Quantity Selector and Add to Cart */}
        <div className="space-y-3 pt-2">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={(e) => handleQuantityChange(e, quantity - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-lg font-medium min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={(e) => handleQuantityChange(e, quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Quick Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Hızlı Sepete Ekle</span>
          </button>
        </div>
      </div>
      </motion.div>
    </Link>
  )
}