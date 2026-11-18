import { closing } from '@/content/home';
import { site } from '@/content/site';
import { loadPricing } from '@/lib/catalog';
import { formatCount } from '@/lib/format';
import styles from './closing-cta.module.css';

const TITLE_ID = 'closing-title';

export async function ClosingCta() {
  const { freeCredits } = await loadPricing();
  return (
    <section className="section" aria-labelledby={TITLE_ID}>
      <div className="container">
        <div className={`frame frame-head-centered ${styles.frame}`}>
          <span className={`rails rails-up ${styles.railsUp}`} aria-hidden="true" />
          <span className="rails rails-down" aria-hidden="true" />
          <h2 id={TITLE_ID} className={styles.title}>
            {closing.title(formatCount(freeCredits))}
          </h2>
          <p className="section-lede">{closing.lede}</p>
          <div className="button-row">
            <a href={site.signupUrl} className="button button-primary">
              {site.primaryCta}
            </a>
            <a href={`mailto:${site.contactEmail}`} className="button button-secondary">
              {closing.contactCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
