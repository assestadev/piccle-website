import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { webinars } from '@/lib/webinars'

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hr.assesta.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host')
  const baseUrl = host ? `https://${host}` : DEFAULT_BASE_URL

  const staticRoutes = ['', '/service', '/inquiry', '/webinar'].map((path) => ({
    url: `${baseUrl}${path}`,
  }))

  const webinarRoutes = webinars.map((webinar) => ({
    url: `${baseUrl}/webinar/${webinar.slug}`,
  }))

  return [...staticRoutes, ...webinarRoutes]
}
