'use client'

import { products } from '@/lib/products'

export default function Products() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Choose Your Power Level
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three models, one mission: giving Gen Z the tech gear that actually gets your lifestyle. 
            From starter to power user - there's a HAYAKU for every hustle.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={`relative bg-white border-2 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                product.popular 
                  ? 'border-red-500 scale-105 lg:scale-110' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {product.badge && (
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold ${
                  product.popular 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-900 text-white'
                }`}>
                  {product.badge}
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="w-full h-48 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center">
                  <div className="text-6xl">🎒</div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">What you get:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {product.price}
                </div>
                <button className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors duration-200 ${
                  product.popular
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}>
                  {product.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-lg text-gray-900 font-medium mb-2">
              🤔 Can't decide?
            </p>
            <p className="text-gray-600 mb-4">
              Most students start with HAYABUSAX1. Power users and creators love the X2POWER. 
              Maximum safety? Go LiFePACK.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Help Me Choose
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}