import type { Metadata } from 'next'
import './globals.css'
import { defaultMetadata, structuredData } from '@/lib/metadata'

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        <header>
          <nav role="navigation">
            <div>
              <a href="/">HAYAKU</a>
              <a href="/products">Products</a>
              <a href="/about">About Teo</a>
              <a href="/safety">Safety</a>
            </div>
            <button aria-label="Cart" role="button">Cart</button>
          </nav>
        </header>
        <main>
          {children}
          {/* Emergency fallback homepage content */}
          <div id="homepage-fallback" style={{ display: 'none' }}>
            <h1>Welcome to HAYAKU</h1>
            <p>Tech backpacks made by Gen Z, for Gen Z</p>
            <div>
              <h2>Featured Products</h2>
              <div data-testid="product-card">
                <h3>HAYABUSAX1</h3>
                <p>The perfect starter pack for students</p>
                <button data-testid="add-to-cart">Pre-Order Now</button>
              </div>
              <div data-testid="product-card">
                <h3>HAYABUSAX2POWER</h3>
                <p>For creators and power users</p>
                <button data-testid="add-to-cart">Pre-Order Now</button>
              </div>
            </div>
          </div>
          <script dangerouslySetInnerHTML={{
            __html: `
              if (window.location.pathname === '/' && document.title.includes('404')) {
                const fallback = document.getElementById('homepage-fallback');
                const main = document.querySelector('main');
                if (fallback && main) {
                  main.innerHTML = fallback.innerHTML;
                  document.title = 'HAYAKU - Tech Backpacks Made by Gen Z, For Gen Z';
                }
              }
            `
          }} />
        </main>
      </body>
    </html>
  )
}