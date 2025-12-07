import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { RatingProvider } from '@/lib/rating-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { BRAND } from '@/lib/brand'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: BRAND.name,
  description: 'HAYAKU – smart youth techwear.',
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`} style={{ fontFamily: BRAND.fontFamily }}>
        <WishlistProvider>
          <RatingProvider>
            {children}
          </RatingProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}