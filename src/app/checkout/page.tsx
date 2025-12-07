'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle,
  Lock,
  Plus,
  Minus,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useStore } from '@/lib/store'
import StripeProvider from '@/components/StripeProvider'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  country: string
}

interface PaymentInfo {
  installments: string
}

// Payment form component using Stripe Elements
function PaymentForm({
  orderId,
  totalAmount,
  onSuccess,
  onError,
  onBack
}: {
  orderId: string
  totalAmount: number
  onSuccess: (orderNumber: string) => void
  onError: (error: string) => void
  onBack: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [installments, setInstallments] = useState('1')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Confirm payment with Stripe
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message || 'Payment form validation failed')
        setIsProcessing(false)
        return
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order=${orderId}`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Payment failed')
        setIsProcessing(false)
        return
      }

      // If payment succeeded, confirm on server
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const confirmResponse = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        const confirmResult = await confirmResponse.json()

        if (confirmResponse.ok && confirmResult.success) {
          onSuccess(orderId)
        } else {
          setErrorMessage(confirmResult.error || 'Payment confirmation failed')
          setIsProcessing(false)
        }
      } else {
        setErrorMessage('Payment is still processing')
        setIsProcessing(false)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setErrorMessage(err.message || 'An unexpected error occurred')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Güvenli Ödeme - Stripe</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Kart bilgileriniz Stripe tarafından güvenli bir şekilde işlenmektedir.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Taksit Seçenekleri
        </label>
        <select
          value={installments}
          onChange={(e) => setInstallments(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
          disabled={isProcessing}
        >
          <option value="1">Peşin - {totalAmount.toLocaleString('tr-TR')} TL</option>
          <option value="3">3 Taksit - {(totalAmount / 3).toLocaleString('tr-TR')} TL</option>
          <option value="6">6 Taksit - {(totalAmount / 6).toLocaleString('tr-TR')} TL</option>
          <option value="9">9 Taksit - {(totalAmount / 9).toLocaleString('tr-TR')} TL</option>
        </select>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Geri
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-luxury-gold text-white py-3 px-6 rounded-lg font-medium hover:bg-luxury-gold/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>İşleniyor...</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Ödemeyi Tamamla</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Türkiye'
  })
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  
  const shippingCost = cartTotal > 500 ? 0 : 29.99
  const totalWithShipping = cartTotal + shippingCost

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate shipping info
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
    const isValid = requiredFields.every(field => shippingInfo[field as keyof ShippingInfo])
    
    if (!isValid) {
      alert('Lütfen tüm zorunlu alanları doldurun')
      return
    }

    setIsCreatingOrder(true)

    try {
      // Create order first
      const orderData = {
        items: cart.map(item => ({
          product_id: item.productId,
          name: item.name,
          sku: item.id,
          price: item.price,
          quantity: item.quantity
        })),
        shipping_address: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          district: shippingInfo.district,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country
        },
        billing_address: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          district: shippingInfo.district,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country
        }
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const orderResult = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Sipariş oluşturulamadı')
      }

      const createdOrder = orderResult.data
      setOrderId(createdOrder.id)
      setOrderNumber(createdOrder.order_number)

      // Create payment intent
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: createdOrder.id,
        }),
      })

      const paymentResult = await paymentResponse.json()

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Ödeme hazırlanamadı')
      }

      setClientSecret(paymentResult.clientSecret)
      setCurrentStep(2)
    } catch (error: any) {
      console.error('Error creating order:', error)
      alert(error.message || 'Sipariş oluşturulurken hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handlePaymentSuccess = (orderNum: string) => {
    clearCart()
    setCurrentStep(3)
    setOrderNumber(orderNum)
  }

  const handlePaymentError = (error: string) => {
    alert(error)
  }

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-luxury-platinum">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-4">
            Sepetiniz Boş
          </h2>
          <p className="text-gray-600 mb-8">
            Ödeme işlemine devam etmek için sepetinize ürün eklemelisiniz.
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

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, title: 'Teslimat Bilgileri' },
              { step: 2, title: 'Ödeme Bilgileri' },
              { step: 3, title: 'Onay' }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= item.step 
                    ? 'bg-luxury-gold text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > item.step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= item.step ? 'text-luxury-charcoal' : 'text-gray-600'
                }`}>
                  {item.title}
                </span>
                {item.step < 3 && (
                  <div className={`w-16 h-1 ml-4 ${
                    currentStep > item.step ? 'bg-luxury-gold' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">
                  Teslimat Bilgileri
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ad *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                        placeholder="0555 123 45 67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      placeholder="Mahalle, Sokak, Apartman No, Daire No"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İl *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İlçe
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.district}
                        onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Posta Kodu
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                        placeholder="34000"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-luxury-gold text-white py-3 px-6 rounded-lg font-medium hover:bg-luxury-gold/90 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Devam Et</span>
                      <Truck className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && clientSecret && orderId && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-6">
                  Ödeme Bilgileri
                </h2>
                
                <StripeProvider clientSecret={clientSecret}>
                  <PaymentForm
                    orderId={orderId}
                    totalAmount={totalWithShipping}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onBack={() => setCurrentStep(1)}
                  />
                </StripeProvider>
              </div>
            )}

            {currentStep === 2 && isCreatingOrder && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-luxury-gold" />
                <p className="text-gray-600">Sipariş hazırlanıyor...</p>
              </div>
            )}

            {currentStep === 3 && orderNumber && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-4">
                  Siparişiniz Alındı!
                </h2>
                <p className="text-gray-600 mb-6">
                  Ödemeniz başarıyla tamamlandı. Kargo bilgileri e-posta adresinize gönderilecek.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Sipariş Numarası</p>
                  <p className="font-mono text-lg font-bold">{orderNumber}</p>
                </div>
                <Link 
                  href={`/order-confirmation?order=${orderNumber}`}
                  className="inline-block bg-luxury-gold text-white px-8 py-3 rounded-lg font-medium hover:bg-luxury-gold/90 transition-colors"
                >
                  Sipariş Detaylarını Görüntüle
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                Sipariş Özeti
              </h3>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs text-gray-500">Resim Yok</div>';
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.size && `Beden: ${item.size}`} {item.color && `Renk: ${item.color}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium text-sm">
                          {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ara Toplam</span>
                  <span>{cartTotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kargo</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost.toLocaleString('tr-TR')} TL`}
                  </span>
                </div>
                {shippingCost === 0 && (
                  <p className="text-xs text-green-600">
                    500 TL üzeri kargo bedava!
                  </p>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Toplam</span>
                  <span>{totalWithShipping.toLocaleString('tr-TR')} TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}