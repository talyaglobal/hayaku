'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')
  const router = useRouter()

  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
    }
  }, [orderNumber, router])

  if (!orderNumber) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-semibold text-gray-900">{orderNumber}</p>
          </div>
          
          <p className="text-gray-600 mb-8">
            You will receive an email confirmation shortly with your order details and tracking information.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/account"
              className="inline-block w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700"
            >
              View My Orders
            </Link>
            
            <Link
              href="/products"
              className="inline-block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}