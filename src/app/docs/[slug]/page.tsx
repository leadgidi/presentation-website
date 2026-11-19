import { notFound } from 'next/navigation';
import { DocBlocks } from '@/components/docs/doc-blocks';
import { DocsShell } from '@/components/docs/docs-shell';
import { docSections, type DocPage } from '@/content/docs';
import { docsMetadata } from '@/lib/docs-metadata';
import { guideHref } from '@/lib/docs-navigation';
import { toAnchorId } from '@/lib/inline-text';

type GuideParams = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

const guides = docSections.flatMap((section) => section.pages);

function findGuide(slug: string): DocPage {
  const guide = guides.find((page) => page.slug === slug);
  if (!guide) notFound();
  return guide;
}

function tableOfContents(guide: DocPage) {
  return guide.blocks.flatMap((block) =>
    block.type === 'heading' ? [{ id: toAnchorId(block.text), label: block.text }] : [],
  );
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuideParams) {
  const guide = findGuide((await params).slug);
  return docsMetadata(guide.title, guide.description, guideHref(guide.slug));
}

export default async function GuidePage({ params }: GuideParams) {
  const guide = findGuide((await params).slug);
  return (
    <DocsShell activeHref={guideHref(guide.slug)} title={guide.title} lede={guide.description} toc={tableOfContents(guide)}>
      <DocBlocks blocks={guide.blocks} />
    </DocsShell>
  );
}
