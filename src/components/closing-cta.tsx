import { closing } from '@/content/home';
import { site } from '@/content/site';
import { loadPricing } from '@/lib/catalog';
import { formatCount } from '@/lib/format';
import { ArrowIcon } from './arrow-icon';
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
          <h2 id={TITLE_ID} className={`${styles.title} text-reveal`}>
            {closing.title(formatCount(freeCredits))}
          </h2>
          <p className="section-lede">{closing.lede}</p>
          <div className="button-row text-reveal">
            <a href={site.signupUrl} className="button button-primary">
              {site.primaryCta}
            </a>
            <a href={site.secondaryCta.href} className="button button-secondary">
              {site.secondaryCta.label}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
