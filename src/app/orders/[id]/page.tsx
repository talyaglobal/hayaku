'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total_amount: number
  payment_status?: string
  order_status: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    price: number
  }>
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params?.id) {
      fetchOrder(params.id as string)
    }
  }, [params?.id])

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Order not found')
      }
      const orderData = await response.json()
      setOrder(orderData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPaymentStatusDisplay = (status?: string) => {
    if (!status) return 'Unknown'
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const getPaymentStatusColor = (status?: string) => {
    if (!status) return 'text-gray-600'
    return status === 'paid' ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested order could not be found.'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
            <p className="text-red-100">Placed on {formatDate(order.created_at)}</p>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Customer Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Name:</span> {order.customer_name}</p>
                  <p><span className="text-gray-600">Email:</span> {order.customer_email}</p>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                    <p className={`mt-1 text-sm ${getPaymentStatusColor(order.payment_status)}`}>
                      {getPaymentStatusDisplay(order.payment_status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                    <span>Product</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Total</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <span className="font-medium text-gray-900">{item.product_name}</span>
                        <span className="text-center text-gray-600">{item.quantity}</span>
                        <span className="text-right text-gray-600">{formatPrice(item.price)}</span>
                        <span className="text-right font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Print Order
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}