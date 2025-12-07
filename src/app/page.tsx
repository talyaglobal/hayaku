import Hero from '@/components/sections/Hero'
import Founder from '@/components/sections/Founder'
import Features from '@/components/sections/Features'
import Products from '@/components/sections/Products'
import Safety from '@/components/sections/Safety'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'

export default function HomePage() {
  // HAYAKU marketing homepage
  return (
    <div className="min-h-screen">
      <Hero />
      <Founder />
      <Features />
      <Products />
      <Safety />
      <Testimonials />
      <CTA />
    </div>
  )
}