import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/** Emitted as a static `robots.txt` at build time. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

export const dynamic = 'force-static';
