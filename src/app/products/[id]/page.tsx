'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/lib/cart-store'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { addItem, toggleCart } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${id}`)
      const result = await response.json()

      if (response.ok) {
        setProduct(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">{error || 'The requested product could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {product.product_images && product.product_images.length > 0 ? (
                <div>
                  <div className="aspect-square relative mb-4">
                    <Image
                      src={product.product_images[selectedImage].url}
                      alt={product.product_images[selectedImage].alt_text || product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {product.product_images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.product_images.map((image, index) => (
                        <button
                          key={image.id || index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square relative rounded-md overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt_text || product.name}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                {product.brands && (
                  <p className="text-sm text-gray-600 mb-1">{product.brands.name}</p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.currency} {product.price}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {product.currency} {product.compare_price}
                    </span>
                  )}
                </div>

                {product.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {product.categories && (
                  <div className="mb-6">
                    <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {product.categories.name}
                    </span>
                  </div>
                )}

                <button 
                  onClick={() => {
                    const cartItem = {
                      id: `${product.id}-${Date.now()}`,
                      product: product,
                      price: product.price,
                      size: '',
                      color: ''
                    }
                    addItem(cartItem)
                    toggleCart()
                  }}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}