import { ReactNode } from 'react';
import { docsCopy } from '@/content/docs';
import { site } from '@/content/site';
import { buildDocsNavigation, findNeighbours, type DocsLink } from '@/lib/docs-navigation';
import { loadApiReference } from '@/lib/openapi';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { DocsSidebar } from './docs-sidebar';
import styles from './docs-shell.module.css';

const MAIN_ID = 'main';

export type TocItem = { id: string; label: string };

type DocsShellProps = {
  activeHref: string;
  title: string;
  lede?: string;
  toc?: TocItem[];
  children: ReactNode;
};

function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <aside className={styles.toc} aria-labelledby="toc-title">
      <p id="toc-title" className={styles.tocTitle}>
        {docsCopy.tocLabel}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.tocLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Pager({ previous, next }: { previous?: DocsLink; next?: DocsLink }) {
  return (
    <nav aria-label={docsCopy.pagerLabel} className={styles.pager}>
      {previous && (
        <a href={previous.href} className={styles.pagerLink}>
          <span className={styles.pagerLabel}>{docsCopy.previousLabel}</span>
          {previous.label}
        </a>
      )}
      {next && (
        <a href={next.href} className={`${styles.pagerLink} ${styles.pagerNext}`}>
          <span className={styles.pagerLabel}>{docsCopy.nextLabel}</span>
          {next.label}
        </a>
      )}
    </nav>
  );
}

export async function DocsShell({ activeHref, title, lede, toc = [], children }: DocsShellProps) {
  const { operations } = await loadApiReference();
  const groups = buildDocsNavigation(operations);
  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link">
        {site.skipToContent}
      </a>
      <SiteHeader hasHero={false} />
      <div className={`container ${styles.layout}`}>
        <DocsSidebar groups={groups} activeHref={activeHref} />
        <main id={MAIN_ID} className={styles.main}>
          <h1 className={styles.title}>{title}</h1>
          {lede && <p className={styles.lede}>{lede}</p>}
          {children}
          <Pager {...findNeighbours(groups, activeHref)} />
        </main>
        {toc.length > 0 && <TableOfContents items={toc} />}
      </div>
      <SiteFooter hasScenery={false} />
    </>
  );
}
