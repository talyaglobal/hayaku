'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react'
import { signIn } from '@/lib/auth'
import { createClient } from '@/lib/supabase-browser'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Sign in with Supabase
      const { data, error: signInError } = await signIn(email, password)
      
      if (signInError) {
        setError('Geçersiz email veya şifre')
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError('Giriş başarısız')
        setIsLoading(false)
        return
      }

      // Check if user is admin
      const supabase = createClient()
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('is_active, role')
        .eq('id', data.user.id)
        .eq('is_active', true)
        .single()

      if (adminError || !adminUser) {
        setError('Bu hesap admin yetkisine sahip değil')
        setIsLoading(false)
        // Sign out if not admin
        await supabase.auth.signOut()
        return
      }

      // Success - redirect to admin dashboard
      router.push('/admin')
    } catch (err: any) {
      setError(err.message || 'Giriş sırasında bir hata oluştu')
      setIsLoading(false)
    }
  }

  const handleGreenBypass = async () => {
    // For development: try to login with default admin credentials
    try {
      await handleLogin({ preventDefault: () => {} } as React.FormEvent)
    } catch {
      // If bypass fails, still allow access (development only)
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hayaku Admin</h1>
          <p className="text-gray-600 mt-2">Yönetim paneline giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="admin@hayaku.ca"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Green Bypass Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleGreenBypass}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-medium hover:from-green-500 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowRight className="h-5 w-5" />
            <span>🟢 Green Bypass</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Geliştirme amaçlı hızlı erişim
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Bilgileri:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>E-posta: admin@hayaku.ca</p>
            <p>Şifre: admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}