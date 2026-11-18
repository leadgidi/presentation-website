import { hero } from '@/content/home';
import { site } from '@/content/site';
import { MOUNTAIN_SIZES, mountainSrcSet } from '@/lib/mountain-sources';
import { FooterClouds } from './footer-clouds';
import { Logo } from './logo';
import { PausableRegion } from './motion-pause';
import styles from './site-footer.module.css';

function FooterColumns() {
  return (
    <nav aria-label={site.footerLabel} className={styles.columns}>
      {site.footerColumns.map((column) => (
        <div key={column.title}>
          <p className={styles.columnTitle}>{column.title}</p>
          <ul className={styles.links}>
            {column.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function FooterLandscape() {
  const { mountain, smoke } = hero.backdrop;
  return (
    <div className={styles.landscape} aria-hidden="true">
      <p className={styles.wordmark}>{site.company}</p>
      <div className={styles.clouds}>
        <FooterClouds sprite={smoke} />
      </div>
      <img
        className={styles.mountain}
        src={mountain.src}
        srcSet={mountainSrcSet(mountain)}
        sizes={MOUNTAIN_SIZES}
        width={mountain.width}
        height={mountain.height}
        alt=""
        loading="lazy"
      />
      <div className={styles.fog} />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.copyright}>{site.copyright}</p>
        </div>
        <FooterColumns />
      </div>
      <PausableRegion className={styles.scenery} buttonClassName={styles.pause}>
        <FooterLandscape />
      </PausableRegion>
    </footer>
  );
}
