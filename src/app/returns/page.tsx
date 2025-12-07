'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { RotateCcw, Shield, Clock, CheckCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-luxury-serif text-luxury-charcoal mb-6">
              İade & Değişim
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Memnuniyetiniz bizim için önemli. Kolay iade ve değişim sürecimiz ile güvenle alışveriş yapın.
            </p>
          </div>
          
          {/* Return Policy Overview */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-2">
                  30 Gün
                </h3>
                <p className="text-gray-600 text-sm">
                  İade süresi
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-luxury-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-2">
                  Ücretsiz İade
                </h3>
                <p className="text-gray-600 text-sm">
                  VIP üyeler için
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-2">
                  Hızlı Onay
                </h3>
                <p className="text-gray-600 text-sm">
                  2-3 iş günü
                </p>
              </div>
            </div>
          </section>
          
          {/* Return Conditions */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              İade Koşulları
            </h2>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-luxury-charcoal mb-2">
                      Ürün Durumu
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ürünler orijinal ambalajında, etiketleri intact ve kullanılmamış durumda olmalıdır. 
                      Parfüm, kozmetik ve iç giyim ürünleri hijyen nedeniyle iade edilemez.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-luxury-charcoal mb-2">
                      Süre Sınırı
                    </h3>
                    <p className="text-gray-600 text-sm">
                      İade talebi ürünün teslim alındığı tarihten itibaren 30 gün içinde yapılmalıdır. 
                      VIP üyelerimiz için bu süre 45 güne uzatılmıştır.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-luxury-charcoal mb-2">
                      Özel Ürünler
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Kişiselleştirilmiş ürünler, özel sipariş ürünleri ve limited edition parçalar 
                      iade edilemez. Bu ürünler satın alma sırasında belirtilir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Return Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              İade Süreci
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">
                  İade Talebi
                </h3>
                <p className="text-gray-600 text-sm">
                  Hesabınızdan veya müşteri hizmetlerinden iade talebi oluşturun
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">
                  Onay & Etiket
                </h3>
                <p className="text-gray-600 text-sm">
                  İade talebiniz onaylandıktan sonra kargo etiketi gönderilir
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">
                  Ürün Gönderimi
                </h3>
                <p className="text-gray-600 text-sm">
                  Ürünü orijinal ambalajında kargo ile gönderin
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">
                  İade Onayı
                </h3>
                <p className="text-gray-600 text-sm">
                  Ürün kontrolünden sonra iade tutarı hesabınıza geçer
                </p>
              </div>
            </div>
          </section>
          
          {/* Exchange Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Değişim İşlemleri
            </h2>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <RotateCcw className="h-6 w-6 text-luxury-gold" />
                    <h3 className="text-lg font-luxury-serif text-luxury-charcoal">
                      Beden Değişimi
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Aynı model, farklı beden</li>
                    <li>• Ücretsiz değişim (VIP için)</li>
                    <li>• 3-5 iş günü sürer</li>
                    <li>• Stok durumuna göre</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <RotateCcw className="h-6 w-6 text-luxury-gold" />
                    <h3 className="text-lg font-luxury-serif text-luxury-charcoal">
                      Renk Değişimi
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Aynı model, farklı renk</li>
                    <li>• Fiyat farkı varsa ek ödeme</li>
                    <li>• 3-5 iş günü sürer</li>
                    <li>• Mevcut renk seçenekleri</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Contact for Returns */}
          <section>
            <div className="bg-gradient-to-r from-luxury-black to-luxury-charcoal rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-luxury-serif mb-4">
                İade konusunda yardıma mı ihtiyacınız var?
              </h2>
              <p className="mb-6 opacity-90">
                Müşteri hizmetleri ekibimiz size yardımcı olmak için 7/24 hizmetinizde
              </p>
              <div className="space-x-4">
                <button className="luxury-button-gold">
                  Canlı Destek
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-luxury-black transition-colors">
                  E-posta Gönder
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}