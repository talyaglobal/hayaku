'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { signIn, getCurrentSession } from '@/lib/auth'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const session = await getCurrentSession()
      if (session?.user) {
        router.push('/account')
      }
    } catch (error) {
      // Not logged in, continue with login
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      await signIn(formData.email, formData.password)
      router.push('/account')
    } catch (error: any) {
      setError(error.message || 'Giriş yapılırken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-luxury-serif text-luxury-charcoal mb-2">
                Giriş Yap
              </h1>
              <p className="text-gray-600">
                Hesabınıza giriş yaparak VIP avantajlarınızdan faydalanın
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-luxury-gold hover:bg-luxury-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>

            {/* Green Bypass Button */}
            <div className="mt-4">
              <button
                onClick={() => router.push('/account')}
                className="w-full flex items-center justify-center py-3 px-4 border border-green-600 rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-colors"
              >
                🚀 Test Bypass (Dev Mode)
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">veya</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Hesabınız yok mu?{' '}
                  <Link href="/auth/signup" className="font-medium text-luxury-gold hover:text-luxury-gold/90">
                    Hemen üye olun
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link href="/auth/forgot-password" className="text-sm text-luxury-gold hover:text-luxury-gold/90">
                  Şifremi unuttum
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-luxury-gold/5 border border-luxury-gold/20 rounded-lg p-6">
            <h3 className="font-medium text-luxury-charcoal mb-3">VIP Üyelik Avantajları</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3"></div>
                Ücretsiz kargo tüm siparişlerde
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3"></div>
                Özel koleksiyonlara erken erişim
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3"></div>
                Kişisel alışveriş danışmanlığı
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3"></div>
                Her alışverişte VIP puan kazanın
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}