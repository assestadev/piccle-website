import type { MetadataRoute } from 'next'
import { webinars } from '@/lib/webinars'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hr.assesta.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/service', '/inquiry', '/webinar'].map((path) => ({
    url: `${BASE_URL}${path}`,
  }))

  const webinarRoutes = webinars.map((webinar) => ({
    url: `${BASE_URL}/webinar/${webinar.slug}`,
  }))

  return [...staticRoutes, ...webinarRoutes]
}
