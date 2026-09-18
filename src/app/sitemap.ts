import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * Emitted as a static `sitemap.xml` at build time. Only real, indexable pages
 * belong here: listing a redirect or a 404 costs crawl budget and is reported
 * as an error in Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${SITE_URL}/privacy-policy/`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

// `output: 'export'` cannot generate a file on request, so the route is
// pre-rendered. Without this Next refuses to export a dynamic metadata route.
export const dynamic = 'force-static';
