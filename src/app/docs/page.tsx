import { DocsIndex } from '@/components/docs/docs-index';
import { DocsShell } from '@/components/docs/docs-shell';
import { docsBasePath, docsCopy } from '@/content/docs';
import { docsMetadata } from '@/lib/docs-metadata';
import { loadApiReference } from '@/lib/openapi';

export const metadata = {
  ...docsMetadata(docsCopy.title, docsCopy.description, docsBasePath),
  title: docsCopy.seoTitle,
};

export default async function DocsHome() {
  const { operations } = await loadApiReference();
  return (
    <DocsShell activeHref={docsBasePath} title={docsCopy.title} lede={docsCopy.lede}>
      <DocsIndex operations={operations} />
    </DocsShell>
  );
}
