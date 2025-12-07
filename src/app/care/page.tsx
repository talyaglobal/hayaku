'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Droplets, Wind, Sun, AlertCircle } from 'lucide-react'

export default function CarePage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-luxury-serif text-luxury-charcoal mb-6">
              Bakım Talimatları
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lüks ürünlerinizin uzun yıllar mükemmel durumda kalması için bakım rehberiniz
            </p>
          </div>
          
          {/* General Care Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Genel Bakım İpuçları
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Yıkama</h3>
                <p className="text-sm text-gray-600">
                  Etiket talimatlarına uygun sıcaklıkta yıkayın
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Kurutma</h3>
                <p className="text-sm text-gray-600">
                  Doğrudan güneş ışığından uzak tutun
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Havalandırma</h3>
                <p className="text-sm text-gray-600">
                  Düzenli olarak havalandırın ve soluk almasını sağlayın
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Dikkat</h3>
                <p className="text-sm text-gray-600">
                  Kimyasal maddelerden ve keskin objelerden uzak tutun
                </p>
              </div>
            </div>
          </section>
          
          {/* Fabric Specific Care */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Kumaşa Özel Bakım
            </h2>
            
            <div className="space-y-6">
              {/* Cotton */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                  Pamuk ve Pamuk Karışımları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 30-40°C'de yıkayın</li>
                      <li>• Benzer renklerle birlikte yıkayın</li>
                      <li>• Düşük ısıda ütüleyebilirsiniz</li>
                      <li>• Makine kurutması uygundur</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılmaması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Çok sıcak suda yıkamayın</li>
                      <li>• Beyazlatıcı kullanmayın</li>
                      <li>• Sıkmayın veya burkmayın</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Wool */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                  Yün ve Kaşmir
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Kuru temizleme tercih edin</li>
                      <li>• El ile soğuk suda yıkayın</li>
                      <li>• Özel yün deterjanı kullanın</li>
                      <li>• Düz yüzeyde kurutun</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılmaması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Makine yıkaması yapmayın</li>
                      <li>• Sıcak suya maruz bırakmayın</li>
                      <li>• Askıda kurutmayın</li>
                      <li>• Direkte ütülemeyin</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Silk */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                  İpek
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Profesyonel kuru temizleme</li>
                      <li>• El ile soğuk suda nazikçe yıkayın</li>
                      <li>• pH nötr deterjan kullanın</li>
                      <li>• Düşük ısıda ters yüzünden ütüleyin</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-luxury-charcoal mb-2">Yapılmaması Gerekenler:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Güneş ışığında kurutmayın</li>
                      <li>• Sert fırçalama yapmayın</li>
                      <li>• Çok sıcak ütü kullanmayın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Leather Care */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Deri Ürün Bakımı
            </h2>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                    Günlük Bakım
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Yumuşak, kuru bezle silin</li>
                    <li>• Su ve neme maruz bırakmayın</li>
                    <li>• Doğrudan ısı kaynaklarından uzak tutun</li>
                    <li>• Havadar yerlerde saklayın</li>
                    <li>• Form koruyucu dolgular kullanın</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                    Periyodik Bakım
                  </h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Ayda bir deri besleyici kullanın</li>
                    <li>• Profesyonel temizlik yaptırın</li>
                    <li>• Leke oluştuğunda hemen müdahale edin</li>
                    <li>• Özel deri koruyucu spreyleri kullanın</li>
                    <li>• Uzun süre kullanmayacaksanız toz torbasında saklayın</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Storage Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8">
              Saklama Önerileri
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                  Giyim Eşyaları
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Kaliteli askılar kullanın</li>
                  <li>• Ceketleri ve gömlekleri askıda saklayın</li>
                  <li>• Kazakları katlanarak saklayın</li>
                  <li>• Nefes alabilen kılıflar kullanın</li>
                  <li>• Dolaba güve kovucu yerleştirin</li>
                  <li>• Sıkışmayacak şekilde yerleştirin</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-luxury-serif text-luxury-charcoal mb-4">
                  Ayakkabı ve Aksesuar
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Ayakkabı ağacı kullanın</li>
                  <li>• Toz torbalarında saklayın</li>
                  <li>• Orijinal kutularını saklayın</li>
                  <li>• Düzenli olarak havalandırın</li>
                  <li>• Nem emici poşetler kullanın</li>
                  <li>• Ayrı bölmelerde organize edin</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Professional Services */}
          <section>
            <div className="bg-gradient-to-r from-luxury-black to-luxury-charcoal rounded-lg p-8 text-white text-center">
              <h2 className="text-2xl font-luxury-serif mb-4">
                Profesyonel Bakım Hizmetleri
              </h2>
              <p className="mb-6 opacity-90">
                Lüks ürünleriniz için özel bakım hizmetleri sunuyoruz
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <h3 className="font-medium mb-1">Deri Bakım</h3>
                  <p className="text-sm opacity-80">Profesyonel deri temizlik ve bakım</p>
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">Onarım</h3>
                  <p className="text-sm opacity-80">Usta terzi ve tamirci hizmetleri</p>
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">Restorasyon</h3>
                  <p className="text-sm opacity-80">Vintage parçalar için özel restorasyon</p>
                </div>
              </div>
              <button className="luxury-button-gold">
                Bakım Hizmeti Talep Et
              </button>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}