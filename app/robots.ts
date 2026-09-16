import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hr.assesta.com'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')
  const baseUrl = host ? `https://${host}` : DEFAULT_BASE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
