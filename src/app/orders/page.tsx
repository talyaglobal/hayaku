'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, Truck, CheckCircle, XCircle, Calendar, MapPin, CreditCard, Eye, RefreshCw } from 'lucide-react'

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Mock orders data - replace with actual data from your API
  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      statusText: 'Teslim Edildi',
      total: 2350.00,
      currency: 'TRY',
      items: [
        {
          id: 1,
          name: 'Burberry Classic Check Scarf',
          brand: 'Burberry',
          size: 'One Size',
          color: 'Camel Check',
          quantity: 1,
          price: 1200.00,
          image: '/api/placeholder/80/80'
        },
        {
          id: 2,
          name: 'Moncler Down Jacket',
          brand: 'Moncler',
          size: 'L',
          color: 'Navy',
          quantity: 1,
          price: 1150.00,
          image: '/api/placeholder/80/80'
        }
      ],
      shippingAddress: 'Ahmet Yılmaz\nAcıbadem Mah. Çeçen Sok. No:15\nKadıköy/İstanbul',
      trackingNumber: 'TR123456789'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-20',
      status: 'shipping',
      statusText: 'Kargoda',
      total: 890.00,
      currency: 'TRY',
      items: [
        {
          id: 3,
          name: 'Prada Milano Logo T-Shirt',
          brand: 'Prada',
          size: 'M',
          color: 'White',
          quantity: 2,
          price: 445.00,
          image: '/api/placeholder/80/80'
        }
      ],
      shippingAddress: 'Ahmet Yılmaz\nAcıbadem Mah. Çeçen Sok. No:15\nKadıköy/İstanbul',
      trackingNumber: 'TR987654321'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-25',
      status: 'processing',
      statusText: 'Hazırlanıyor',
      total: 3200.00,
      currency: 'TRY',
      items: [
        {
          id: 4,
          name: 'Bottega Veneta Intrecciato Wallet',
          brand: 'Bottega Veneta',
          size: 'One Size',
          color: 'Black',
          quantity: 1,
          price: 3200.00,
          image: '/api/placeholder/80/80'
        }
      ],
      shippingAddress: 'Ahmet Yılmaz\nAcıbadem Mah. Çeçen Sok. No:15\nKadıköy/İstanbul',
      trackingNumber: null
    }
  ]

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'shipping': return <Truck className="h-5 w-5 text-blue-500" />
      case 'processing': return <RefreshCw className="h-5 w-5 text-orange-500" />
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'text-green-700 bg-green-50 border-green-200'
      case 'shipping': return 'text-blue-700 bg-blue-50 border-blue-200'
      case 'processing': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter)

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
                { key: 'all', label: 'Tüm Siparişler', count: orders.length },
                { key: 'processing', label: 'Hazırlanıyor', count: orders.filter(o => o.status === 'processing').length },
                { key: 'shipping', label: 'Kargoda', count: orders.filter(o => o.status === 'shipping').length },
                { key: 'delivered', label: 'Teslim Edildi', count: orders.filter(o => o.status === 'delivered').length }
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
                <p className="text-gray-600 mb-6">Bu kategoride henüz sipariş bulunmuyor.</p>
                <a
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
                >
                  Alışverişe Başla
                </a>
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
                            <h3 className="font-semibold text-gray-900">Sipariş {order.id}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(order.date).toLocaleDateString('tr-TR')}</span>
                              </span>
                              <span>{order.items.length} ürün</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.statusText}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {order.currency}
                          </div>
                          <div className="text-xs text-gray-600">KDV Dahil</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.brand}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>Beden: {item.size}</span>
                              <span>Renk: {item.color}</span>
                              <span>Adet: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {order.currency}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Actions */}
                  <div className="bg-gray-50 px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="whitespace-pre-line">{order.shippingAddress}</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {order.trackingNumber && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Truck className="h-4 w-4" />
                            <span>Takip No: {order.trackingNumber}</span>
                          </div>
                        )}
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Detaylar</span>
                        </button>
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
          
          {filteredOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8 text-center">
              <p className="text-gray-600 mb-4">Daha eski siparişleri görüntülemek isterseniz:</p>
              <button className="px-6 py-3 text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors">
                Tüm Siparişleri Görüntüle
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}