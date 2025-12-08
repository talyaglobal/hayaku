'use client'

import { heroContent, founderContent, ctaContent } from '../lib/marketing-content'
import { products } from '../lib/products'
import { features } from '../lib/features'
import { safetyContent } from '../lib/safety'
import { testimonials } from '../lib/testimonials'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
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

      {/* Founder Section */}
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Choose Your Power Level
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three models, one mission: giving Gen Z the tech gear that actually gets your lifestyle.
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
        </div>
      </section>

      {/* Safety */}
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real People, Real Reviews
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From students to parents to creators - here's what the HAYAKU community is saying.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {ctaContent.main.headline}
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-red-100 leading-relaxed">
            {ctaContent.main.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
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
        </div>
      </section>
    </>
  )
}