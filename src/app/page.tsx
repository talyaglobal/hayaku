import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BrandCarousel from '@/components/BrandCarousel'
import FeaturedProducts from '@/components/FeaturedProducts'
import ShoppingCart from '@/components/ShoppingCart'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BrandCarousel />
      <FeaturedProducts />
      <ShoppingCart />
      <Footer />
    </main>
  )
}