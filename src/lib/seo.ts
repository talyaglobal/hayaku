import { MetadataRoute } from 'next'

export function generateSitemapUrl(
  url: string,
  lastModified: Date,
  priority: number
): MetadataRoute.Sitemap[0] {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hayaku.com'
  
  return {
    url: `${baseUrl}${url}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority
  }
}

export const siteConfig = {
  locale: 'en_US'
}