import { apiReferenceBasePath, docsBasePath, docsCopy, docSections } from '@/content/docs';
import type { ApiOperation } from './openapi';

export type DocsLink = { label: string; href: string };
export type DocsGroup = { title: string; links: DocsLink[] };

export function guideHref(slug: string): string {
  return `${docsBasePath}${slug}/`;
}

export function operationHref(slug: string): string {
  return `${apiReferenceBasePath}${slug}/`;
}

export function buildDocsNavigation(operations: ApiOperation[]): DocsGroup[] {
  const guideGroups = docSections.map((section) => ({
    title: section.title,
    links: section.pages.map((page) => ({ label: page.title, href: guideHref(page.slug) })),
  }));
  const referenceGroup = {
    title: docsCopy.apiReferenceTitle,
    links: operations.map((operation) => ({ label: operation.summary, href: operationHref(operation.slug) })),
  };
  return [...guideGroups, referenceGroup];
}

export function findNeighbours(groups: DocsGroup[], href: string): { previous?: DocsLink; next?: DocsLink } {
  const links = groups.flatMap((group) => group.links);
  const index = links.findIndex((link) => link.href === href);
  if (index < 0) return {};
  return { previous: links[index - 1], next: links[index + 1] };
}
