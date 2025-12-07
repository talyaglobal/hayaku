'use client'

import { useState } from 'react'
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Zap,
  Users,
  MessageSquare,
  Share2,
  BarChart3
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackButton from '@/components/BackButton'

interface Integration {
  id: string
  name: string
  icon: any
  description: string
  status: 'connected' | 'disconnected' | 'error'
  features: string[]
  metrics?: {
    label: string
    value: string
  }[]
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      description: 'Facebook Business hesabınızı bağlayın ve ürünlerinizi Facebook Shop\'ta satın',
      status: 'disconnected',
      features: [
        'Facebook Shop entegrasyonu',
        'Otomatik ürün senkronizasyonu',
        'Facebook Ads kampanya yönetimi',
        'Müşteri mesajları yönetimi',
        'Analitik raporları'
      ],
      metrics: [
        { label: 'Takipçiler', value: '0' },
        { label: 'Bu Ay Erişim', value: '0' },
        { label: 'Satışlar', value: '0₺' }
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'Instagram Business hesabınızı bağlayın ve Instagram Shopping özelliklerini kullanın',
      status: 'connected',
      features: [
        'Instagram Shopping etiketleri',
        'Story ve post entegrasyonu',
        'Otomatik ürün katalog senkronizasyonu',
        'DM otomatik yanıtları',
        'Influencer kampanya takibi'
      ],
      metrics: [
        { label: 'Takipçiler', value: '12.5K' },
        { label: 'Bu Ay Erişim', value: '45.2K' },
        { label: 'Satışlar', value: '28.500₺' }
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: MessageCircle,
      description: 'WhatsApp Business API ile müşteri desteği ve satış süreçlerinizi otomatikleştirin',
      status: 'error',
      features: [
        'Otomatik müşteri yanıtları',
        'Sipariş takip bildirimleri',
        'Katalog paylaşımı',
        'Toplu mesaj gönderimi',
        'Müşteri destek chat botu'
      ],
      metrics: [
        { label: 'Aktif Sohbetler', value: '0' },
        { label: 'Bu Ay Mesaj', value: '0' },
        { label: 'Yanıt Oranı', value: '0%' }
      ]
    }
  ])

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'connected' }
          : integration
      )
    )
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, status: 'disconnected' }
          : integration
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5" />
      case 'error': return <AlertCircle className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Bağlı'
      case 'error': return 'Hata'
      default: return 'Bağlantı Yok'
    }
  }

  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      <BackButton />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-luxury-serif text-luxury-charcoal mb-6">
            Entegrasyonlar
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sosyal medya platformlarınızı bağlayın ve satış kanallarınızı genişletin
          </p>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="h-6 w-6 text-green-600" />
              <h3 className="font-medium text-gray-900">Aktif Entegrasyonlar</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {integrations.filter(i => i.status === 'connected').length}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="font-medium text-gray-900">Toplam Erişim</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">45.2K</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <h3 className="font-medium text-gray-900">Bu Ay Mesaj</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">1.2K</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-6 w-6 text-amber-600" />
              <h3 className="font-medium text-gray-900">Sosyal Satış</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">28.500₺</p>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {integrations.map((integration) => {
            const Icon = integration.icon
            
            return (
              <div key={integration.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Icon className="h-6 w-6 text-gray-700" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {integration.name}
                      </h3>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span>{getStatusText(integration.status)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {integration.description}
                  </p>
                </div>

                {/* Metrics */}
                {integration.metrics && (
                  <div className="p-6 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">İstatistikler</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {integration.metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                          <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                          <p className="text-xs text-gray-500">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Özellikler</h4>
                  <ul className="space-y-2">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="flex space-x-3">
                    {integration.status === 'connected' ? (
                      <>
                        <button
                          onClick={() => handleDisconnect(integration.id)}
                          className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Bağlantıyı Kes
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
                          <Settings className="h-4 w-4 mr-1" />
                          Ayarlar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration.id)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-luxury-gold hover:bg-luxury-gold/90 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Bağlan</span>
                      </button>
                    )}
                  </div>
                  
                  {integration.status === 'error' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-red-800 font-medium">Bağlantı Hatası</p>
                          <p className="text-red-600">
                            API anahtarınızı kontrol edin veya destek ekibiyle iletişime geçin.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center">
            <Share2 className="h-12 w-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Yardıma İhtiyacınız Var Mı?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Entegrasyonlarınızı kurarken sorun yaşıyorsanız, detaylı kurulum kılavuzlarımıza göz atın 
              veya destek ekibimizle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 text-sm font-medium text-luxury-gold border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors">
                Kurulum Kılavuzu
              </button>
              <button className="px-6 py-3 text-sm font-medium text-white bg-luxury-gold hover:bg-luxury-gold/90 rounded-lg transition-colors">
                Destek Al
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}