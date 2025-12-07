'use client'

import { testimonials } from '@/lib/testimonials'

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real People, Real Reviews
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From students to parents to creators - here's what the HAYAKU community is saying about the backpack that finally gets it right.
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
        
        <div className="mt-16 text-center">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-lg mb-4">🔥 Join the community</p>
            <p className="text-gray-300">
              1000+ students, creators, and parents trust HAYAKU. 
              Be part of the movement that's changing tech gear forever.
            </p>
            <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Join the HAYAKU Family
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}