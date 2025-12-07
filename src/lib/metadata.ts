import type { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: "HAYAKU - Tech Backpacks Made by Gen Z, For Gen Z | Teo Guzel, Age 13",
  description: "Meet Teo Guzel, the 13-year-old founder who created the world's safest charging backpack. LiFePO₄ technology meets street style. Finally, tech gear that gets your generation.",
  keywords: [
    "tech backpack",
    "charging backpack", 
    "Gen Z",
    "young entrepreneur",
    "student backpack",
    "gaming backpack",
    "LiFePO4 battery",
    "safe charging",
    "Teo Guzel",
    "HAYAKU",
    "teenage founder",
    "13 year old CEO"
  ],
  authors: [{ name: "Teo Guzel", url: "https://hayaku.com" }],
  creator: "Teo Guzel",
  publisher: "HAYAKU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hayaku.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "HAYAKU - Finally, Tech Gear That Gets Your Generation",
    description: "Created by 13-year-old Teo Guzel. The world's safest charging backpack designed by someone who actually lives the Gen Z experience.",
    url: 'https://hayaku.com',
    siteName: 'HAYAKU',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HAYAKU - Tech backpacks made by Gen Z for Gen Z',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "HAYAKU - Tech Backpacks Made by Gen Z, For Gen Z",
    description: "Meet the 13-year-old who's changing tech forever.",
    images: ['/og-image.jpg'],
    creator: '@hayaku_tech',
    site: '@hayaku_tech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
    other: {
      me: ['teo@hayaku.com', 'https://hayaku.com'],
    },
  },
}

export function generatePageMetadata(
  title: string,
  description: string, 
  path?: string,
  image?: string
): Metadata {
  return {
    title: `${title} | HAYAKU`,
    description,
    openGraph: {
      title: `${title} | HAYAKU`,
      description,
      url: path ? `https://hayaku.com${path}` : 'https://hayaku.com',
      images: image ? [
        {
          url: image,
          width: 1200, 
          height: 630,
          alt: title,
        }
      ] : defaultMetadata.openGraph?.images,
    },
    twitter: {
      title: `${title} | HAYAKU`,
      description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
  }
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HAYAKU",
  "description": "Tech backpacks made by Gen Z, for Gen Z",
  "url": "https://hayaku.com",
  "logo": "https://hayaku.com/logo.png",
  "foundingDate": "2024",
  "founder": {
    "@type": "Person",
    "name": "Teo Guzel",
    "age": "13",
    "description": "13-year-old founder and CEO of HAYAKU"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CA"
  },
  "sameAs": [
    "https://twitter.com/hayaku_tech",
    "https://instagram.com/hayaku_tech",
    "https://linkedin.com/company/hayaku"
  ]
}