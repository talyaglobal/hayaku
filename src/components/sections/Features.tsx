'use client'

import { features } from '@/lib/features'

export default function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Built Different, Built Right
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature designed by someone who actually carries this stuff daily. 
            No corporate boardroom guesses - just real solutions for real problems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-block bg-black text-white px-8 py-4 rounded-full">
            <span className="text-lg font-medium">
              💡 Designed by Gen Z, for Gen Z - no compromises
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}