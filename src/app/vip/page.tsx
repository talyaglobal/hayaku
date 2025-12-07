'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Crown, Truck, Calendar, Gift, Headphones, Shield } from 'lucide-react'

export default function VIPPage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-luxury-charcoal to-gray-800"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="mb-8">
                <Crown className="h-16 w-16 mx-auto mb-4 text-luxury-gold" />
              </div>
              <h1 className="text-5xl md:text-7xl font-luxury-serif font-bold mb-6">
                VIP Üyelik
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Özel ayrıcalıklar ve lüks alışveriş deneyimi
              </p>
              <button className="luxury-button-gold text-lg px-8 py-4">
                Hemen Üye Ol
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
              VIP Ayrıcalıkları
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hayaku VIP üyesi olarak size özel avantajlardan yararlanın
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                Ücretsiz Kargo
              </h3>
              <p className="text-gray-600">
                Tüm siparişlerinizde ücretsiz kargo ve hızlı teslimat
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                Erken Erişim
              </h3>
              <p className="text-gray-600">
                Yeni koleksiyonlara ve özel kampanyalara öncelikli erişim
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                Özel Hediyeler
              </h3>
              <p className="text-gray-600">
                Doğum gününüzde ve özel günlerde sürpriz hediyeler
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                VIP Destek
              </h3>
              <p className="text-gray-600">
                7/24 özel müşteri hizmetleri ve kişisel alışveriş danışmanlığı
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                Premium Garanti
              </h3>
              <p className="text-gray-600">
                Genişletilmiş garanti süresi ve kolaylaştırılmış iade süreci
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-3">
                Özel Etkinlikler
              </h3>
              <p className="text-gray-600">
                VIP üyelerimize özel moda gösterileri ve etkinliklere davet
              </p>
            </div>
          </div>
        </section>
        
        {/* Membership Plans */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
              Üyelik Paketleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size en uygun VIP paketini seçin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  Silver
                </h3>
                <div className="text-4xl font-bold text-gray-400 mb-2">₺299</div>
                <div className="text-gray-600">/ yıl</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">Ücretsiz kargo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">%5 indirim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">Öncelikli müşteri hizmetleri</span>
                </li>
              </ul>
              
              <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Silver Üyelik
              </button>
            </div>
            
            {/* Gold */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-luxury-gold relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-luxury-gold text-white px-4 py-1 rounded-full text-sm font-medium">
                  En Popüler
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  Gold
                </h3>
                <div className="text-4xl font-bold text-luxury-gold mb-2">₺599</div>
                <div className="text-gray-600">/ yıl</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">Tüm Silver avantajları</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">%10 indirim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">Erken erişim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">Özel hediyeler</span>
                </li>
              </ul>
              
              <button className="w-full luxury-button">
                Gold Üyelik
              </button>
            </div>
            
            {/* Platinum */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  Platinum
                </h3>
                <div className="text-4xl font-bold text-luxury-charcoal mb-2">₺999</div>
                <div className="text-gray-600">/ yıl</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">Tüm Gold avantajları</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">%15 indirim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">Kişisel alışveriş danışmanı</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">VIP etkinlik davetleri</span>
                </li>
              </ul>
              
              <button className="w-full py-3 bg-luxury-charcoal text-white rounded-lg hover:bg-gray-800 transition-colors">
                Platinum Üyelik
              </button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="text-center bg-white rounded-lg p-12 shadow-sm">
          <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
            Lüks alışveriş deneyiminizi başlatın
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            VIP üyemiz olun ve size özel ayrıcalıklardan yararlanmaya hemen başlayın
          </p>
          <button className="luxury-button-gold text-lg px-8 py-4">
            VIP Üye Ol
          </button>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}