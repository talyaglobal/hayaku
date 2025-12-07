'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Truck, Clock, MapPin, Package } from 'lucide-react'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-luxury-serif text-luxury-charcoal mb-6">
              Kargo & Teslimat
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lüks ürünlerinizi güvenle ve zamanında teslim ediyoruz
            </p>
          </div>
          
          {/* Shipping Options */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Teslimat Seçenekleri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-luxury-gold rounded-lg flex items-center justify-center">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury-serif text-luxury-charcoal">
                      Standart Kargo
                    </h3>
                    <p className="text-gray-600">2-3 iş günü</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 2000₺ üzeri siparişlerde ücretsiz</li>
                  <li>• 2000₺ altı siparişlerde 29₺</li>
                  <li>• Türkiye geneli teslimat</li>
                  <li>• Kargo takip numarası</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-luxury-gold">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-luxury-charcoal rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-luxury-serif text-luxury-charcoal">
                      Hızlı Teslimat
                    </h3>
                    <p className="text-gray-600">1 iş günü</p>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li>• 49₺ sabit fiyat</li>
                  <li>• İstanbul, Ankara, İzmir</li>
                  <li>• 14:00'e kadar verilen siparişler</li>
                  <li>• SMS ve email bilgilendirme</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* VIP Shipping */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-luxury-black to-luxury-charcoal rounded-lg p-8 text-white">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-luxury-serif mb-2">
                    VIP Üye Avantajları
                  </h3>
                  <p className="opacity-90">
                    Özel teslimat hizmetleri ve ayrıcalıklar
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Ücretsiz Kargo</h4>
                  <p className="text-sm opacity-90">Tüm siparişlerde</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Öncelikli Teslimat</h4>
                  <p className="text-sm opacity-90">Hızlı işlem</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium mb-2">Özel Ambalaj</h4>
                  <p className="text-sm opacity-90">Lüks sunum</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Delivery Areas */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Teslimat Bölgeleri
            </h2>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-5 w-5 text-luxury-gold" />
                    <h3 className="font-medium text-luxury-charcoal">
                      Büyük Şehirler
                    </h3>
                  </div>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>İstanbul - 1-2 gün</li>
                    <li>Ankara - 1-2 gün</li>
                    <li>İzmir - 1-2 gün</li>
                    <li>Antalya - 2-3 gün</li>
                    <li>Bursa - 2-3 gün</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-5 w-5 text-luxury-gold" />
                    <h3 className="font-medium text-luxury-charcoal">
                      Anadolu Bölgesi
                    </h3>
                  </div>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>Doğu Anadolu - 3-4 gün</li>
                    <li>Güneydoğu Anadolu - 3-4 gün</li>
                    <li>İç Anadolu - 2-3 gün</li>
                    <li>Karadeniz - 2-3 gün</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="h-5 w-5 text-luxury-gold" />
                    <h3 className="font-medium text-luxury-charcoal">
                      Özel Bölgeler
                    </h3>
                  </div>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>Ada illeri - 4-5 gün</li>
                    <li>Dağlık bölgeler - 3-5 gün</li>
                    <li>Kırsal kesim - 3-4 gün</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Important Information */}
          <section>
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Önemli Bilgiler
            </h2>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-luxury-charcoal mb-2">
                    Teslimat Zamanları
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Kargolar Pazartesi-Cuma 09:00-18:00, Cumartesi 09:00-15:00 saatleri 
                    arasında teslim edilir. Pazar günü teslimat yapılmaz.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-luxury-charcoal mb-2">
                    Özel Ürün Teslimatı
                  </h3>
                  <p className="text-gray-600 text-sm">
                    10.000₺ üzeri değerdeki ürünler özel kargo ile teslim edilir ve 
                    imzalı teslim alınır. Bu ürünler için ek süre gerekebilir.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-luxury-charcoal mb-2">
                    Teslimat Takibi
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Siparişiniz kargoya verildiğinde SMS ve email ile bilgilendirilirsiniz. 
                    Takip numaranız ile kargonuzun konumunu takip edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}