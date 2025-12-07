'use client'

import { useState } from 'react'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import { useCartStore } from '@/lib/cart-store'
import { useRouter } from 'next/navigation'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, getCartTotal, clearCart } = useCartStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw new Error(submitError.message)
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on server and create order
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            items: items,
            shippingAddress: {}, // TODO: Add shipping form
            billingAddress: {}, // TODO: Add billing form
          }),
        })

        const result = await response.json()

        if (response.ok) {
          clearCart()
          router.push(`/order-confirmation?orderNumber=${result.orderNumber}`)
        } else {
          throw new Error(result.error)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      
      <PaymentElement />
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
      </button>
    </form>
  )
}