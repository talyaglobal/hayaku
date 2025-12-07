import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { RatingProvider } from '@/lib/rating-context'
import { WishlistProvider } from '@/lib/wishlist-context'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'Hayaku - Luxury Menswear Collection',
  description: 'Discover the world\'s finest luxury menswear from heritage brands. Premium fashion, exceptional craftsmanship, and sophisticated style for the modern gentleman.',
  keywords: 'luxury menswear, designer clothing, premium fashion, Prada, Moncler, Burberry, high-end fashion',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
        <WishlistProvider>
          <RatingProvider>
            {children}
          </RatingProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}