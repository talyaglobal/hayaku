'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg"
          alt="Luxury Fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="font-luxury-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                Lüks
                <br />
                <span className="text-luxury-gold">Yeniden Tanımlandı</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                Sofistike tarzı ve yüksek kaliteyi temsil eden miras markalarından 
                dünyanın en çok aranan lüks erkek modasını keşfedin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link href="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="luxury-button text-lg px-12 py-4"
                  >
                    Koleksiyonları Keşfet
                  </motion.button>
                </Link>
                
                <Link href="/products?new=true">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="luxury-button-outline text-lg px-12 py-4 border-white text-white hover:bg-white hover:text-black"
                  >
                    {t('newArrivals')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}