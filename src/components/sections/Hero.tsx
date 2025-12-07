'use client'

import { heroContent } from '@/lib/marketing-content'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block bg-red-600/20 border border-red-600/40 rounded-full px-6 py-2 mb-8 text-red-400 font-medium backdrop-blur-sm">
          {heroContent.badge}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
            {heroContent.title}
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          {heroContent.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {heroContent.primaryCTA}
          </button>
          <button className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm hover:bg-white/10">
            {heroContent.secondaryCTA}
          </button>
        </div>
        
        <div className="mt-16 text-gray-400">
          <p className="text-lg">🔥 Join 1000+ students already powered by HAYAKU</p>
        </div>
      </div>
    </section>
  )
}