'use client'

import { ctaContent } from '@/lib/marketing-content'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {ctaContent.main.headline}
        </h2>
        
        <p className="text-xl md:text-2xl mb-12 text-red-100 leading-relaxed">
          {ctaContent.main.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <button className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {ctaContent.main.primaryButton}
          </button>
          <button className="border-2 border-white hover:bg-white hover:text-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200">
            {ctaContent.main.secondaryButton}
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {ctaContent.guarantees.map((guarantee, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center"
            >
              <p className="text-sm font-medium text-white/90">{guarantee}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-red-100 mb-2">🔥 Limited Pre-Order Spots Available</p>
          <p className="text-sm text-red-200">
            Be among the first 1000 to experience the future of tech gear
          </p>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-20 right-10 w-6 h-6 bg-blue-400 rounded-full animate-bounce opacity-40"></div>
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50"></div>
    </section>
  )
}