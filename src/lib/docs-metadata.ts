import type { Metadata } from 'next';
import { docsCopy } from '@/content/docs';

export function docsMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} | ${docsCopy.pageTitleSuffix}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: { type: 'article', url: path, title: fullTitle, description },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}
