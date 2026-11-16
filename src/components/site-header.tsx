import { site } from '@/content/site';
import { HeaderShell } from './header-shell';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import styles from './site-header.module.css';

export function SiteHeader() {
  return (
    <HeaderShell className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <a href="/" className={styles.home}>
          <Logo />
        </a>
        <nav aria-label={site.navigationLabel} className={styles.navigation}>
          <ul className={styles.links}>
            {site.navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.actions}>
          <a href={site.signInUrl} className={`button button-outline button-small ${styles.signIn}`}>
            {site.signIn}
          </a>
          <a href={site.signupUrl} className={`button button-primary button-small ${styles.cta}`}>
            {site.primaryCta}
          </a>
          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
