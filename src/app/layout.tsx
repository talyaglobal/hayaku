import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Header from '@/components/Header'
import CartSidebar from '@/components/CartSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hayaku - Luxury E-commerce',
  description: 'Premium luxury fashion and lifestyle products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav role="navigation">
            <div>
              <a href="/">Hayaku</a>
              <a href="/products">Products</a>
            </div>
            <button aria-label="Cart" role="button">Cart</button>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}