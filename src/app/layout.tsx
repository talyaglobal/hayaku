import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'HAYAKU - Tech Gear That Gets Your Generation',
  description: 'The world\'s safest charging backpack, created by a 13-year-old for Gen Z. LiFePO₄ technology meets street-level style.',
  keywords: 'backpack, charging backpack, Gen Z, tech gear, LiFePO4, safe charging, student backpack',
  authors: [{ name: 'Teo Guzel', url: 'https://hayaku.com' }],
  creator: 'Teo Guzel',
  openGraph: {
    title: 'HAYAKU - Tech Gear That Gets Your Generation',
    description: 'The world\'s safest charging backpack, created by a 13-year-old for Gen Z.',
    url: 'https://hayaku.com',
    siteName: 'HAYAKU',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HAYAKU - Tech Backpacks Made by Gen Z, For Gen Z',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAYAKU - Tech Gear That Gets Your Generation',
    description: 'The world\'s safest charging backpack, created by a 13-year-old for Gen Z.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}