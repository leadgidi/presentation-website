import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import { ReactNode } from 'react';
import { site } from '@/content/site';
import './globals.css';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-sans' });

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

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.company,
  url: site.url,
  email: site.contactEmail,
  description: site.seoDescription,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </body>
    </html>
  );
}
