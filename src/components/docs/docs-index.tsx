import { docsCopy, docSections } from '@/content/docs';
import { guideHref, operationHref } from '@/lib/docs-navigation';
import { toAnchorId } from '@/lib/inline-text';
import type { ApiOperation } from '@/lib/openapi';
import styles from './docs-index.module.css';

type IndexLink = { label: string; href: string; description: string };

function IndexSection({ title, links }: { title: string; links: IndexLink[] }) {
  return (
    <section aria-labelledby={toAnchorId(title)}>
      <h2 id={toAnchorId(title)} className={styles.sectionTitle}>
        {title}
      </h2>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={styles.link}>
              <span className={styles.linkTitle}>{link.label}</span>
              <span className={styles.linkDescription}>{link.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DocsIndex({ operations }: { operations: ApiOperation[] }) {
  const referenceLinks = operations.map((operation) => ({
    label: operation.summary,
    href: operationHref(operation.slug),
    description: `${operation.method} ${operation.path.replaceAll('/', '/\u200B')}`,
  }));
  return (
    <div className={styles.index}>
      {docSections.map((section) => (
        <IndexSection
          key={section.title}
          title={section.title}
          links={section.pages.map((page) => ({
            label: page.title,
            href: guideHref(page.slug),
            description: page.description,
          }))}
        />
      ))}
      <IndexSection title={docsCopy.apiReferenceTitle} links={referenceLinks} />
    </div>
  );
}
