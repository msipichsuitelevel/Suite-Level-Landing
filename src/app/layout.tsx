import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { DevTools } from '@/components/DevTools';
import { COMPANY, SITE_URL } from '@/lib/site';
import './globals.css';

/**
 * Self-hosted by Next at build time, so the exported site makes no request to
 * Google Fonts. `display: swap` keeps text visible while the face loads.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const TITLE = 'Suite Level: the CRE platform brokers run their market on';
const DESCRIPTION =
  'Suite Level is where broker teams track tenants in the market, lease comps, market supply, competitive sets and stacking plans in one place, and share a live view with their clients. Private beta.';

export const metadata: Metadata = {
  // Every relative URL in this file and in the page metadata resolves against
  // this, so canonical URLs and OG images come out absolute, as crawlers require.
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Suite Level',
  },
  description: DESCRIPTION,
  applicationName: 'Suite Level',
  authors: [{ name: COMPANY.legalName, url: SITE_URL }],
  creator: COMPANY.legalName,
  publisher: COMPANY.legalName,
  keywords: [
    'commercial real estate software',
    'CRE broker platform',
    'lease comps software',
    'tenants in the market',
    'market supply tracking',
    'competitive set analysis',
    'stacking plan software',
    'CRE client reporting',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Suite Level',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Suite Level: your market, your portfolio.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  category: 'business',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The design is light-only by deliberate choice: it is built around light
  // product screenshots, so it does not follow the device's dark mode.
  colorScheme: 'light',
  themeColor: '#333333',
};

/**
 * Organization and WebSite markup, emitted on every page. The product and FAQ
 * markup is page-specific and lives on the home page instead.
 */
function SiteJsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: COMPANY.name,
        legalName: COMPANY.legalName,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        email: COMPANY.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY.addressLines.join(', '),
          addressLocality: COMPANY.locality,
          addressRegion: COMPANY.region,
          postalCode: COMPANY.postalCode,
          addressCountry: COMPANY.country,
        },
        founder: [
          { '@type': 'Person', name: 'Taylor DeBerry', jobTitle: 'CEO & co-founder' },
          { '@type': 'Person', name: 'Michael Sipich', jobTitle: 'Engineering & co-founder' },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: COMPANY.name,
        description: DESCRIPTION,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-US',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // The payload is built from constants in this repository, never from user
      // input, so there is nothing here for an injected string to escape into.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteJsonLd />
        {children}
        {/* Stripped from production builds: NODE_ENV is inlined, so this folds
            to false and the component and its import are dropped. */}
        {process.env.NODE_ENV === 'development' && <DevTools />}
      </body>
    </html>
  );
}
