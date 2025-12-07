'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Ruler, Info, Calculator } from 'lucide-react'

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-luxury-serif text-luxury-charcoal mb-6">
              Beden Rehberi
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Size en uygun bedeni seçebilmeniz için detaylı ölçü rehberimizi hazırladık
            </p>
          </div>
          
          {/* Size Charts */}
          <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Clothing Sizes */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-luxury-gold rounded-lg flex items-center justify-center">
                    <Ruler className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-luxury-serif text-luxury-charcoal">
                      Giyim Bedenleri
                    </h2>
                    <p className="text-gray-600 text-sm">Ceket, gömlek, kazak</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium">Beden</th>
                        <th className="text-left py-2 font-medium">Göğüs (cm)</th>
                        <th className="text-left py-2 font-medium">Bel (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">S</td>
                        <td className="py-2">88-92</td>
                        <td className="py-2">78-82</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">M</td>
                        <td className="py-2">96-100</td>
                        <td className="py-2">86-90</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">L</td>
                        <td className="py-2">104-108</td>
                        <td className="py-2">94-98</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">XL</td>
                        <td className="py-2">112-116</td>
                        <td className="py-2">102-106</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">XXL</td>
                        <td className="py-2">120-124</td>
                        <td className="py-2">110-114</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Shoe Sizes */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-luxury-charcoal rounded-lg flex items-center justify-center">
                    <Ruler className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-luxury-serif text-luxury-charcoal">
                      Ayakkabı Bedenleri
                    </h2>
                    <p className="text-gray-600 text-sm">Erkek ayakkabı</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium">EU</th>
                        <th className="text-left py-2 font-medium">UK</th>
                        <th className="text-left py-2 font-medium">CM</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">40</td>
                        <td className="py-2">6.5</td>
                        <td className="py-2">25.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">41</td>
                        <td className="py-2">7.5</td>
                        <td className="py-2">26</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">42</td>
                        <td className="py-2">8</td>
                        <td className="py-2">26.5</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">43</td>
                        <td className="py-2">9</td>
                        <td className="py-2">27</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium">44</td>
                        <td className="py-2">9.5</td>
                        <td className="py-2">27.5</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">45</td>
                        <td className="py-2">10.5</td>
                        <td className="py-2">28</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Accessories */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-luxury-serif text-luxury-charcoal">
                      Aksesuar Bedenleri
                    </h2>
                    <p className="text-gray-600 text-sm">Kemer, saat</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-luxury-charcoal mb-2">Kemer Bedenleri</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>85cm - Bel 28-30"</p>
                      <p>90cm - Bel 32-34"</p>
                      <p>95cm - Bel 36-38"</p>
                      <p>100cm - Bel 40-42"</p>
                      <p>105cm - Bel 44-46"</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-luxury-charcoal mb-2">Saat Bedenleri</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Small - 15-17cm</p>
                      <p>Medium - 17-19cm</p>
                      <p>Large - 19-21cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* How to Measure */}
          <section className="mb-12">
            <h2 className="text-2xl font-luxury-serif text-luxury-charcoal mb-8 text-center">
              Nasıl Ölçüm Yapılır?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Göğüs</h3>
                <p className="text-sm text-gray-600">
                  Kolları yana açık pozisyonda, göğsün en geniş yerinden ölçün
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Bel</h3>
                <p className="text-sm text-gray-600">
                  Doğal bel çizginizden, nefes vererek rahat durumda ölçün
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👟</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Ayak</h3>
                <p className="text-sm text-gray-600">
                  Duvarın önünde durarak ayağınızın en uzun noktasından ölçün
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⌚</span>
                </div>
                <h3 className="font-medium text-luxury-charcoal mb-2">Bilek</h3>
                <p className="text-sm text-gray-600">
                  Bilek kemiğinin hemen altından, rahat durumda ölçün
                </p>
              </div>
            </div>
          </section>
          
          {/* Tips */}
          <section>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-luxury-serif text-luxury-charcoal mb-4">
                    Beden Seçim İpuçları
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                    <ul className="space-y-2 text-sm">
                      <li>• İki beden arasında kaldıysanız, büyük bedeni tercih edin</li>
                      <li>• İtalyan markaları genelde dar kesimlidir</li>
                      <li>• Premium deri ürünler zamanla genişler</li>
                      <li>• Kış kıyafetleri için bir beden büyük alabilirsiniz</li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li>• Ayakkabılarda akşam ölçüm yapın (ayaklar günün sonunda şişer)</li>
                      <li>• Luxury markalar özel kesim kullanabilir</li>
                      <li>• Şüphede kaldığınızda müşteri hizmetlerimizle iletişime geçin</li>
                      <li>• VIP üyelerimiz için ücretsiz beden değişimi mevcuttur</li>
                    </ul>
                  </div>
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