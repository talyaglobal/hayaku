'use client'

import { safetyContent } from '@/lib/safety'

export default function Safety() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 border border-orange-300 rounded-full px-6 py-2 mb-6 text-orange-700 font-medium">
            {safetyContent.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {safetyContent.headline}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {safetyContent.intro}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Dangerous Li-ion */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-red-700">
              {safetyContent.comparison.dangerous.title}
            </h3>
            <ul className="space-y-4">
              {safetyContent.comparison.dangerous.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-red-500 text-lg">🚫</span>
                  <span className="text-red-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Safe LiFePO₄ */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-green-700">
              {safetyContent.comparison.safe.title}
            </h3>
            <ul className="space-y-4">
              {safetyContent.comparison.safe.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 text-lg">🛡️</span>
                  <span className="text-green-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <div className="bg-gray-900 text-white p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-xl font-medium mb-4">💡 The Bottom Line</p>
            <p className="text-lg leading-relaxed">
              {safetyContent.conclusion}
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
            🛡️ Shop Safe with HAYAKU
          </button>
        </div>
      </div>
    </section>
  )
}