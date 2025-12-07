'use client'

import { founderContent } from '@/lib/marketing-content'

export default function Founder() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-2xl mb-4">{founderContent.greeting}</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
              {founderContent.headline}
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              {founderContent.story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12">
              {founderContent.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 text-white">
                <div className="w-full h-64 md:h-80 bg-gray-800/20 rounded-2xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👨‍💻</span>
                    </div>
                    <p className="text-lg opacity-90">Teo Guzel</p>
                    <p className="text-sm opacity-75">Founder & CEO, Age 13</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <p className="text-sm opacity-90 italic">
                    "I saw the problems, so I built the solution. That's what our generation does."
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}