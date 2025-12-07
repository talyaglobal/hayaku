'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, Truck, CheckCircle, XCircle, Calendar, MapPin, Eye, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  products?: {
    name: string
    slug: string
    brands?: { name: string }
    product_images?: Array<{ url: string; is_primary: boolean }>
  }
}

interface Order {
  id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
  total_amount: number
  currency: string
  created_at: string
  shipping_address?: any
  tracking_number?: string
  order_items?: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  
  useEffect(() => {
    loadOrders()
  }, [activeFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (activeFilter !== 'all') {
        params.append('status', activeFilter)
      }
      
      const response = await fetch(`/api/orders?${params.toString()}`)
      const result = await response.json()
      
      if (response.ok) {
        setOrders(result.data || [])
      } else {
        if (response.status === 401) {
          router.push('/auth/login')
          return
        }
        setError(result.error || 'Failed to load orders')
      }
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('An error occurred while loading orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'shipped': return <Truck className="h-5 w-5 text-blue-500" />
      case 'processing': 
      case 'confirmed': return <RefreshCw className="h-5 w-5 text-orange-500" />
      case 'cancelled': 
      case 'refunded': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Beklemede',
      'confirmed': 'Onaylandı',
      'processing': 'Hazırlanıyor',
      'shipped': 'Kargoda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi',
      'refunded': 'İade Edildi'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'text-green-700 bg-green-50 border-green-200'
      case 'shipped': return 'text-blue-700 bg-blue-50 border-blue-200'
      case 'processing':
      case 'confirmed': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'cancelled':
      case 'refunded': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const formatAddress = (address: any) => {
    if (!address) return 'Adres bilgisi yok'
    if (typeof address === 'string') return address
    const parts = []
    if (address.full_name) parts.push(address.full_name)
    if (address.address_line_1) parts.push(address.address_line_1)
    if (address.address_line_2) parts.push(address.address_line_2)
    if (address.city || address.state) parts.push(`${address.postal_code || ''} ${address.city || ''}/${address.state || ''}`.trim())
    if (address.country) parts.push(address.country)
    return parts.join('\n') || 'Adres bilgisi yok'
  }

  const getProductImage = (item: OrderItem) => {
    if (item.products?.product_images?.length) {
      const primaryImage = item.products.product_images.find(img => img.is_primary)
      return primaryImage?.url || item.products.product_images[0]?.url
    }
    return null
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => ['processing', 'confirmed'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : activeFilter === 'processing'
    ? orders.filter(order => ['processing', 'confirmed'].includes(order.status))
    : orders.filter(order => order.status === activeFilter)

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
                <span className="text-gray-600">Siparişler yükleniyor...</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-red-900 mb-2">Hata</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadOrders}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-luxury-serif text-luxury-charcoal mb-8">
            Siparişlerim
          </h1>
          
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tüm Siparişler', count: statusCounts.all },
                { key: 'processing', label: 'Hazırlanıyor', count: statusCounts.processing },
                { key: 'shipped', label: 'Kargoda', count: statusCounts.shipped },
                { key: 'delivered', label: 'Teslim Edildi', count: statusCounts.delivered }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? 'bg-luxury-gold text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
          
          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Sipariş bulunamadı</h3>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'all' 
                    ? 'Henüz sipariş vermemişsiniz.'
                    : 'Bu kategoride henüz sipariş bulunmuyor.'}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-gray-900">Sipariş {order.order_number}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(order.created_at).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}</span>
                              </span>
                              <span>{order.order_items?.length || 0} ürün</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {order.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {order.currency || 'TRY'}
                          </div>
                          <div className="text-xs text-gray-600">KDV Dahil</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.order_items.map(item => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              {getProductImage(item) ? (
                                <img 
                                  src={getProductImage(item)!} 
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                              {item.products?.brands?.name && (
                                <p className="text-sm text-gray-600">{item.products.brands.name}</p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span>Adet: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {item.total_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {order.currency || 'TRY'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.unit_price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {order.currency || 'TRY'} / adet
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Order Actions */}
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="whitespace-pre-line">{formatAddress(order.shipping_address)}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {order.tracking_number && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span>Takip No: {order.tracking_number}</span>
                          </div>
                        )}
                        <Link
                          href={`/orders/${order.id}`}
                          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Detaylar</span>
                        </Link>
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 text-sm font-medium text-white bg-luxury-gold rounded-lg hover:bg-luxury-gold/90 transition-colors">
                            Tekrar Sipariş Ver
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
