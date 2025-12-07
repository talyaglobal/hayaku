'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { User, Calendar, Heart, Sparkles, Phone, Mail } from 'lucide-react'

export default function PersonalShoppingPage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold via-amber-600 to-orange-700"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="mb-8">
                <Sparkles className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h1 className="text-5xl md:text-7xl font-luxury-serif font-bold mb-6">
                Kişisel Alışveriş
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Size özel stil danışmanlığı ve kişiselleştirilmiş alışveriş deneyimi
              </p>
              <button className="luxury-button-white text-lg px-8 py-4">
                Randevu Al
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-16">
        {/* Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uzman stil danışmanlarımız size özel çözümler sunuyor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                Kişisel Stil Danışmanlığı
              </h3>
              <p className="text-gray-600 mb-4">
                Vücut tipinize ve yaşam tarzınıza uygun kişisel stil rehberliği
              </p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Renk analizi</li>
                <li>• Vücut tipi analizi</li>
                <li>• Stil profili oluşturma</li>
                <li>• Gardrob düzenleme</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-luxury-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                Özel Etkinlik Hazırlığı
              </h3>
              <p className="text-gray-600 mb-4">
                Özel günleriniz için mükemmel kombinler
              </p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Düğün hazırlığı</li>
                <li>• İş toplantıları</li>
                <li>• Gala ve davetler</li>
                <li>• Tatil kombinleri</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                VIP Alışveriş Deneyimi
              </h3>
              <p className="text-gray-600 mb-4">
                Size özel hazırlanmış koleksiyonlar ve öncelikli hizmet
              </p>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Özel showroom</li>
                <li>• Evde deneme hizmeti</li>
                <li>• Erken erişim</li>
                <li>• Özel indirimler</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              4 adımda kişiselleştirilmiş alışveriş deneyimi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-gold to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-3">
                Konsültasyon
              </h3>
              <p className="text-gray-600 text-sm">
                Stil tercihlerinizi ve ihtiyaçlarınızı anlıyoruz
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-luxury-charcoal to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-3">
                Kişiselleştirme
              </h3>
              <p className="text-gray-600 text-sm">
                Size özel koleksiyon ve kombinler hazırlıyoruz
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-3">
                Sunum
              </h3>
              <p className="text-gray-600 text-sm">
                Seçenekleri size özel showroom'da sunuyoruz
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">4</span>
              </div>
              <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-3">
                Teslim
              </h3>
              <p className="text-gray-600 text-sm">
                Seçimlerinizi özel ambalajla teslim ediyoruz
              </p>
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-4">
              Hizmet Paketleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun paketi seçin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  Temel
                </h3>
                <div className="text-4xl font-bold text-gray-600 mb-2">₺499</div>
                <div className="text-gray-600">/ seans</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">1 saatlik konsültasyon</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">Stil profili oluşturma</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-700">5 parça öneri</span>
                </li>
              </ul>
              
              <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Temel Paket
              </button>
            </div>
            
            {/* Premium */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-luxury-gold relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-luxury-gold text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popüler
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  Premium
                </h3>
                <div className="text-4xl font-bold text-luxury-gold mb-2">₺1.299</div>
                <div className="text-gray-600">/ seans</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">2 saatlik konsültasyon</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">Detaylı renk analizi</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">15 parça öneri</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-gold rounded-full"></div>
                  <span className="text-gray-700">Evde deneme hizmeti</span>
                </li>
              </ul>
              
              <button className="w-full luxury-button">
                Premium Paket
              </button>
            </div>
            
            {/* VIP */}
            <div className="bg-white rounded-lg p-8 shadow-sm border">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-luxury-serif text-luxury-charcoal mb-2">
                  VIP
                </h3>
                <div className="text-4xl font-bold text-luxury-charcoal mb-2">₺2.999</div>
                <div className="text-gray-600">/ seans</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">4 saatlik özel deneyim</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">Komple gardrob planı</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">Sınırsız parça önerisi</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-luxury-charcoal rounded-full"></div>
                  <span className="text-gray-700">3 aylık takip</span>
                </li>
              </ul>
              
              <button className="w-full py-3 bg-luxury-charcoal text-white rounded-lg hover:bg-gray-800 transition-colors">
                VIP Paket
              </button>
            </div>
          </div>
        </section>
        
        {/* Contact */}
        <section>
          <div className="bg-gradient-to-r from-luxury-black to-luxury-charcoal rounded-lg p-12 text-white text-center">
            <h2 className="text-3xl font-luxury-serif mb-6">
              Kişisel Alışveriş Randevusu
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Size özel stil danışmanlığı için randevu alın. Uzman ekibimiz en uygun zamanı sizinle planlayacak.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+90 538 350 17 11</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>personal@hayaku.ca</span>
              </div>
            </div>
            
            <button className="luxury-button-gold text-lg px-8 py-4">
              Randevu Al
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}