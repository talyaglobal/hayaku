'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-platinum">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-6xl font-luxury-serif text-luxury-charcoal mb-6">
            Hayaku Hakkında
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lüks erkek modasının yeni adresi olarak, dünyanın en prestijli markalarını bir araya getiriyoruz
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-6">
                Hikayemiz
              </h2>
              <p className="text-gray-600 mb-4">
                Hayaku, modern erkeğin sofistike tarzını yansıtan, kaliteli ve özgün parçaları 
                bir araya getirmek amacıyla kurulmuştur. Moda dünyasının en seçkin markalarından 
                özenle seçilen koleksiyonlarımız ile, stilinizi mükemmelleştirmenize yardımcı oluyoruz.
              </p>
              <p className="text-gray-600 mb-4">
                Her parça, kalite, şıklık ve zamansız tasarım anlayışımızı yansıtır. 
                Müşterilerimize sadece ürün değil, bir yaşam tarzı sunuyoruz.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg"
                alt="Hayaku Store"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-12 text-center">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">K</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Kalite</h3>
              <p className="text-gray-600">
                En yüksek kalite standartlarını karşılayan, dünya çapında tanınan markalar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">O</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Özgünlük</h3>
              <p className="text-gray-600">
                Her parça otantik ve orijinal, sahte ürünlere kesinlikle yer yok
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-luxury-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Servis</h3>
              <p className="text-gray-600">
                Müşteri memnuniyeti odaklı, kişiselleştirilmiş alışveriş deneyimi
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="bg-white rounded-lg p-8 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-luxury-serif text-luxury-charcoal mb-6">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-gray-600 mb-8">
              Sorularınız için bize ulaşmaktan çekinmeyin. Size yardımcı olmak için buradayız.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">info@hayaku.ca</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Telefon</h3>
                <p className="text-gray-600">+90 212 XXX XX XX</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Adres</h3>
                <p className="text-gray-600">İstanbul, Türkiye</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}