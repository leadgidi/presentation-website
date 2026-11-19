import type { MetadataRoute } from 'next';
import { docsBasePath, docSections } from '@/content/docs';
import { site } from '@/content/site';
import { guideHref, operationHref } from '@/lib/docs-navigation';
import { loadApiReference } from '@/lib/openapi';

export const dynamic = 'force-static';

function docsEntry(path: string): MetadataRoute.Sitemap[number] {
  return { url: `${site.url}${path}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { operations } = await loadApiReference();
  const guidePaths = docSections.flatMap((section) => section.pages.map((page) => guideHref(page.slug)));
  const operationPaths = operations.map((operation) => operationHref(operation.slug));
  return [
    { url: `${site.url}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    ...[docsBasePath, ...guidePaths, ...operationPaths].map(docsEntry),
  ];
}
