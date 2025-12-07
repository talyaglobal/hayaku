'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, CreditCard, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  subtotal: number
  shipping_amount: number
  tax_amount: number
  total_amount: number
  currency: string
  shipping_address: any
  created_at: string
  order_items: any[]
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails(orderNumber)
    }
  }, [orderNumber])

  const fetchOrderDetails = async (orderNum: string) => {
    try {
      const response = await fetch(`/api/orders?orderNumber=${orderNum}`)
      const result = await response.json()
      
      if (response.ok && result.orders && result.orders.length > 0) {
        setOrder(result.orders[0])
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-6 w-6 text-yellow-500" />
      case 'processing':
        return <Package className="h-6 w-6 text-blue-500" />
      case 'shipped':
        return <Truck className="h-6 w-6 text-green-500" />
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede'
      case 'processing':
        return 'Hazırlanıyor'
      case 'shipped':
        return 'Kargoya Verildi'
      case 'delivered':
        return 'Teslim Edildi'
      default:
        return 'Bilinmiyor'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede'
      case 'paid':
        return 'Ödendi'
      case 'failed':
        return 'Başarısız'
      case 'refunded':
        return 'İade Edildi'
      default:
        return 'Bilinmiyor'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-4">
            Sipariş Bulunamadı
          </h2>
          <p className="text-gray-600 mb-8">
            Belirtilen sipariş numarası bulunamadı.
          </p>
          <Link 
            href="/products"
            className="inline-block bg-luxury-gold text-white px-8 py-3 rounded-lg font-medium hover:bg-luxury-gold/90 transition-colors"
          >
            Alışverişe Devam Et
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/products" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Alışverişe Devam Et</span>
        </Link>

        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-luxury-serif text-luxury-charcoal mb-2">
            Siparişiniz Alındı!
          </h1>
          <p className="text-gray-600 mb-4">
            Sipariş numaranız: <span className="font-bold text-luxury-gold">{order.order_number}</span>
          </p>
          <p className="text-sm text-gray-500">
            Sipariş onay e-postası {order.shipping_address?.email} adresine gönderilecektir.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4 flex items-center">
                {getStatusIcon(order.status)}
                <span className="ml-2">Sipariş Durumu</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className="font-medium">{getStatusText(order.status)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ödeme:</span>
                  <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sipariş Tarihi:</span>
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                Sipariş Detayları
              </h3>
              
              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.total_price.toLocaleString('tr-TR')} TRY</p>
                      <p className="text-sm text-gray-500">
                        {item.unit_price.toLocaleString('tr-TR')} TRY / adet
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Teslimat Adresi
              </h3>
              
              <div className="text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                </p>
                <p>{order.shipping_address?.address}</p>
                <p>
                  {order.shipping_address?.district}, {order.shipping_address?.city} {order.shipping_address?.postal_code}
                </p>
                <p>{order.shipping_address?.country}</p>
                <p className="mt-2">
                  <span className="font-medium">Telefon:</span> {order.shipping_address?.phone}
                </p>
                <p>
                  <span className="font-medium">E-posta:</span> {order.shipping_address?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Sipariş Özeti
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span>{order.subtotal.toLocaleString('tr-TR')} TRY</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo:</span>
                  <span>
                    {order.shipping_amount === 0 ? 'Ücretsiz' : `${order.shipping_amount.toLocaleString('tr-TR')} TRY`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Vergi:</span>
                  <span>{order.tax_amount.toLocaleString('tr-TR')} TRY</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam:</span>
                  <span>{order.total_amount.toLocaleString('tr-TR')} TRY</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-luxury-gold/5 rounded-lg p-6 border border-luxury-gold/20">
              <h4 className="font-luxury-serif text-luxury-charcoal mb-3 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Sonraki Adımlar
              </h4>
              
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sipariş onay e-postanızı kontrol edin</li>
                <li>• Kargo takip bilgileri e-posta ile gönderilecek</li>
                <li>• Sorularınız için müşteri hizmetlerimizle iletişime geçin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
        </div>
        <Footer />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}