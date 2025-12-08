'use client'

import { founderContent } from '../../lib/marketing-content'
import { testimonials } from '../../lib/testimonials'

export default function MeetTeoPage() {
  const achievements = [
    {
      icon: '🚀',
      title: 'Founded HAYAKU at 13',
      description: 'Started the company while in grade 8, identifying real problems students face daily'
    },
    {
      icon: '🎯', 
      title: 'First Gen Z Tech Brand',
      description: 'Created the first tech brand designed entirely by someone living the Gen Z experience'
    },
    {
      icon: '🔥',
      title: '1000+ Pre-orders',
      description: 'Generated massive demand before even launching the first product'
    },
    {
      icon: '🛡️',
      title: 'Safety-First Innovation',
      description: 'Chose LiFePO₄ over cheaper Li-ion batteries, prioritizing user safety'
    },
    {
      icon: '📱',
      title: 'C-Charge Technology',
      description: 'Invented the charging window system that eliminates cable mess'
    },
    {
      icon: '💡',
      title: 'Problem-Solution Mindset',
      description: 'Believes in building solutions for real problems, not just making products'
    }
  ]

  const timeline = [
    {
      year: 'Age 11',
      title: 'The Problem Discovery',
      description: 'Teo noticed how his friends\' phones died at school and how ugly existing charging solutions were. He started sketching ideas for a better backpack.',
      icon: '💭'
    },
    {
      year: 'Age 12', 
      title: 'Research Phase',
      description: 'Spent months researching battery technology, materials, and design. Discovered the safety issues with Li-ion batteries and chose LiFePO₄.',
      icon: '📚'
    },
    {
      year: 'Age 13',
      title: 'HAYAKU Launch',
      description: 'Founded HAYAKU with the mission to create tech gear by Gen Z, for Gen Z. Started with the revolutionary C-Charge system.',
      icon: '🚀'
    },
    {
      year: 'Present',
      title: 'Scaling the Vision', 
      description: 'Growing HAYAKU into the premier Gen Z tech brand, with plans for multiple product lines and global expansion.',
      icon: '🌍'
    }
  ]

  const values = [
    {
      title: 'Authenticity Over Everything',
      description: 'Never pretend to understand what you don\'t live. Every decision comes from real Gen Z experience.',
      icon: '💯'
    },
    {
      title: 'Safety First, Always',
      description: 'No cutting corners on safety. If it might hurt someone, it\'s not worth making.',
      icon: '🛡️'
    },
    {
      title: 'Function Meets Style',
      description: 'Good design isn\'t just pretty - it has to actually work in real life.',
      icon: '⚡'
    },
    {
      title: 'Young Voice, Real Impact',
      description: 'Age doesn\'t limit innovation. Sometimes fresh perspective is exactly what\'s needed.',
      icon: '🎯'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-red-600/20 border border-red-600/40 rounded-full px-6 py-2 mb-6 text-red-400 font-medium">
                👋 Meet the Founder
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                I'm Teo Guzel, <br />
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Age 13
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {founderContent.story[0]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Read My Story
                </button>
                <button className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm hover:bg-white/10">
                  Contact Me
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-96 bg-gray-800/20 rounded-2xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">👨‍💻</span>
                    </div>
                    <h3 className="text-2xl font-bold opacity-90 mb-2">Teo Guzel</h3>
                    <p className="text-lg opacity-75 mb-4">Founder & CEO, Age 13</p>
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                      <p className="text-sm opacity-90 italic">
                        "I saw the problems, so I built the solution. That's what our generation does."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {founderContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">My Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How a 13-year-old turned everyday frustrations into a revolutionary tech brand
            </p>
          </div>

          <div className="space-y-8">
            {founderContent.story.map((paragraph, index) => (
              <div key={index} className={`flex items-start gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-3"></div>
                <div className="flex-1">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Journey</h2>
            <p className="text-xl text-gray-600">
              From idea to innovation - the HAYAKU story
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-600 rounded-full"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-8' : 'lg:pl-8'}`}>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <div className="text-red-600 font-semibold mb-3">{item.year}</div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white"></div>
                
                <div className="w-full lg:w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What I've Built</h2>
            <p className="text-xl text-gray-600">
              Innovation happens when you combine fresh perspective with real problems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What I Believe</h2>
            <p className="text-xl text-gray-300">
              The values that drive everything I build
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex gap-6">
                <div className="text-4xl">{value.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials About Teo */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What People Say</h2>
            <p className="text-xl text-gray-600">
              From customers to industry leaders - reactions to the 13-year-old founder
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.filter((_, index) => index < 6).map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Connect?</h2>
          <p className="text-xl text-red-100 mb-8">
            I love hearing from other young entrepreneurs, students, and anyone who believes age is just a number.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105">
              📧 Send Me an Email
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200">
              💬 Message on Social
            </button>
          </div>
          
          <p className="text-red-100 text-sm">
            *I try to respond to everyone personally, though it might take a few days during school weeks!
          </p>
        </div>
      </section>
    </div>
  )
}