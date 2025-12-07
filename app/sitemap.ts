import { MetadataRoute } from 'next'
import { generateSitemapUrl } from '@/lib/seo'

// This would typically fetch from your database
async function getProducts() {
  // Replace with actual database call
  return [
    { id: '1', slug: 'luxury-watch', updatedAt: new Date('2024-01-15') },
    { id: '2', slug: 'designer-bag', updatedAt: new Date('2024-01-10') }
  ]
}

async function getCategories() {
  return [
    { slug: 'watches', updatedAt: new Date('2024-01-01') },
    { slug: 'bags', updatedAt: new Date('2024-01-01') },
    { slug: 'jewelry', updatedAt: new Date('2024-01-01') }
  ]
}

async function getBrands() {
  return [
    { slug: 'rolex', updatedAt: new Date('2024-01-01') },
    { slug: 'gucci', updatedAt: new Date('2024-01-01') }
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hayaku.com'

  // Static pages
  const staticPages = [
    generateSitemapUrl('/', new Date(), 1.0),
    generateSitemapUrl('/about', new Date('2024-01-01'), 0.8),
    generateSitemapUrl('/contact', new Date('2024-01-01'), 0.7),
    generateSitemapUrl('/shipping', new Date('2024-01-01'), 0.6),
    generateSitemapUrl('/care', new Date('2024-01-01'), 0.5),
    generateSitemapUrl('/vip', new Date('2024-01-01'), 0.8),
    generateSitemapUrl('/sale', new Date(), 0.9)
  ]

  // Dynamic pages
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(), 
    getBrands()
  ])

  const productPages = products.map(product => 
    generateSitemapUrl(`/products/${product.id}`, product.updatedAt, 0.8)
  )

  const categoryPages = categories.map(category =>
    generateSitemapUrl(`/categories/${category.slug}`, category.updatedAt, 0.7)
  )

  const brandPages = brands.map(brand =>
    generateSitemapUrl(`/brands/${brand.slug}`, brand.updatedAt, 0.6)
  )

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...brandPages
  ]
}