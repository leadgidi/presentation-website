import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { site } from '@/content/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', axes: ['opsz'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seoTitle,
  description: site.seoDescription,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.company,
    title: site.seoTitle,
    description: site.seoDescription,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: site.seoTitle, description: site.seoDescription },
  robots: { index: true, follow: true },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: site.company,
      url: site.url,
      logo: `${site.url}${site.brand.markPng}`,
      email: site.contactEmail,
      description: site.seoDescription,
    },
    {
      '@type': 'WebSite',
      name: site.company,
      url: site.url,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
