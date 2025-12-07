'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, ShoppingBag, Truck, RotateCcw, Shield, Star } from 'lucide-react'
import { getProduct } from '@/lib/products'
import { useStore } from '@/lib/store'
import { useRating } from '@/lib/rating-context'
import { useWishlist } from '@/lib/wishlist-context'
import ShoppingCart from '@/components/ShoppingCart'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [])

  const loadProduct = async () => {
    try {
      const resolvedParams = await params
      const productData = await getProduct(resolvedParams.id)
      setProduct(productData)
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h1>
          <Link href="/products" className="text-luxury-gold hover:underline">
            Ürünlere dön
          </Link>
        </div>
      </div>
    )
  }

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: any }) {
  const { addToCart, toggleCart } = useStore()
  const { getRating, setRating: setGlobalRating } = useRating()
  const { isInWishlist, toggleWishlist } = useWishlist()
  
  const [quantity, setQuantity] = useState(1)
  const [hoverRating, setHoverRating] = useState(0)
  
  const rating = getRating(product.id)
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        productId: product.id,
        name: product.name,
        brand: product.brand_name || 'Luxury Brand',
        price: product.price,
        image: product.product_images?.[0]?.url || '/placeholder-product.jpg',
        size: 'Standard',
        color: 'Default',
        inStock: true
      })
    }
    // Show success notification and open cart after a short delay
    alert('Ürün sepete eklendi!')
    setTimeout(() => {
      toggleCart()
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link 
          href="/products" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Ürünlere Dön</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
              {product.product_images?.[0]?.url ? (
                <img
                  src={product.product_images[0].url}
                  alt={product.product_images[0].alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-64 h-64 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                  <span className="font-luxury-serif text-6xl font-bold text-luxury-gold">
                    {product.name?.charAt(0) || 'P'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.slice(0, 4).map((image: any, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Brand and Title */}
            <div>
              <p className="text-sm font-medium text-luxury-gold mb-2">{product.brand_name || 'Luxury Brand'}</p>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <button
                  onClick={() => toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.product_images?.[0]?.url || '/placeholder-product.jpg',
                    brand: product.brand_name || 'Luxury Brand',
                    slug: product.slug || product.id
                  })}
                  className={`p-2 rounded-full transition-colors ${
                    inWishlist 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${inWishlist ? 'fill-red-500' : ''}`} />
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setGlobalRating(product.id, star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-colors"
                    >
                      <Star 
                        className={`h-4 w-4 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({rating} yıldız)</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center space-x-4">
                <p className="text-3xl font-bold text-gray-900">
                  {product.price?.toLocaleString('tr-TR')} {product.currency || 'TRY'}
                </p>
                {product.compare_price && product.compare_price > product.price && (
                  <p className="text-xl text-gray-500 line-through">
                    {product.compare_price.toLocaleString('tr-TR')} {product.currency || 'TRY'}
                  </p>
                )}
              </div>
              {product.is_featured && (
                <p className="text-sm text-luxury-gold font-medium mt-1">Öne Çıkan Ürün</p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Adet</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Sepete Ekle</span>
              </button>
              
              <button
                onClick={() => {
                  toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.product_images?.[0]?.url || '/placeholder-product.jpg',
                    brand: product.brand_name || 'Luxury Brand',
                    slug: product.slug || product.id
                  })
                  alert(inWishlist ? 'Favorilerden çıkarıldı!' : 'Favorilere eklendi!')
                }}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  inWishlist 
                    ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100' 
                    : 'border border-gray-300 text-gray-900 hover:border-gray-400'
                }`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{inWishlist ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Ücretsiz Kargo</p>
                  <p className="text-sm text-gray-600">2000 TL üzeri siparişlerde</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <RotateCcw className="h-5 w-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">30 Gün İade</p>
                  <p className="text-sm text-gray-600">Koşulsuz iade garantisi</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-luxury-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Orijinallik Garantisi</p>
                  <p className="text-sm text-gray-600">%100 orijinal ürün güvencesi</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ürün Detayları</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-gray-600 w-24">SKU:</span>
                  <span className="text-gray-900">{product.sku}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Marka:</span>
                  <span className="text-gray-900">{product.brand_name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Kategori:</span>
                  <span className="text-gray-900">{product.category_name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">Durum:</span>
                  <span className={product.is_active ? 'text-green-600' : 'text-red-600'}>
                    {product.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShoppingCart />
    </div>
  )
}