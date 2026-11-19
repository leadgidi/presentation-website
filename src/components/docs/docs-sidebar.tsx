import { docsBasePath, docsCopy } from '@/content/docs';
import type { DocsGroup } from '@/lib/docs-navigation';
import styles from './docs-shell.module.css';

type DocsSidebarProps = { groups: DocsGroup[]; activeHref: string };

function DocsLinks({ groups, activeHref }: DocsSidebarProps) {
  return (
    <>
      <a
        href={docsBasePath}
        className={styles.sideLink}
        aria-current={activeHref === docsBasePath ? 'page' : undefined}
      >
        {docsCopy.title}
      </a>
      {groups.map((group) => (
        <div key={group.title} className={styles.sideGroup}>
          <p className={styles.sideGroupTitle}>{group.title}</p>
          <ul>
            {group.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.sideLink}
                  aria-current={link.href === activeHref ? 'page' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function DocsSidebar({ groups, activeHref }: DocsSidebarProps) {
  return (
    <nav aria-label={docsCopy.navigationLabel} className={styles.sidebar}>
      <details className={styles.mobileNavigation}>
        <summary className={styles.mobileSummary}>{docsCopy.browseLabel}</summary>
        <div className={styles.mobileLinks}>
          <DocsLinks groups={groups} activeHref={activeHref} />
        </div>
      </details>
      <div className={styles.desktopLinks}>
        <DocsLinks groups={groups} activeHref={activeHref} />
      </div>
    </nav>
  );
}
