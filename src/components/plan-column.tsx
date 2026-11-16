import { pricingCopy } from '@/content/home';
import { PlanPricing } from '@/content/pricing';
import { PlanOffer } from '@/lib/pricing';
import styles from './plan-column.module.css';

type FeatureRow = { label: string; isIncluded: boolean; isUpcoming: boolean };

function featureRows(plan: PlanPricing, allFeatures: string[], creditsLine: string): FeatureRow[] {
  const owned = new Map(plan.features.map((feature) => [feature.label, feature]));
  return [
    { label: creditsLine, isIncluded: true, isUpcoming: false },
    { label: pricingCopy.buyCreditsFeature, isIncluded: plan.kind === 'paid', isUpcoming: false },
    ...allFeatures.map((label) => ({
      label,
      isIncluded: owned.has(label),
      isUpcoming: owned.get(label)?.isUpcoming ?? false,
    })),
  ];
}

function FeatureList({ rows }: { rows: FeatureRow[] }) {
  return (
    <div className={styles.includes}>
      <p className={styles.includesLabel}>{pricingCopy.includesLabel}</p>
      <ul className={styles.features}>
        {rows.map((row) => (
          <li key={row.label} className={styles.feature} data-included={row.isIncluded || undefined} data-upcoming={row.isUpcoming || undefined}>
            <span className="visually-hidden">{row.isIncluded ? pricingCopy.includedLabel : pricingCopy.notIncludedLabel}: </span>
            <span>{row.label}</span>
            {row.isUpcoming && <span className={styles.upcoming}>{pricingCopy.upcomingLabel}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlanSummary({ plan, offer }: { plan: PlanPricing; offer: PlanOffer }) {
  return (
    <>
      <div className={styles.nameRow}>
        <h3 className={styles.name}>{plan.label}</h3>
        {plan.isHighlighted && <span className={styles.recommended}>{pricingCopy.recommendedLabel}</span>}
      </div>
      <p className={styles.tagline}>{plan.tagline}</p>
      <p className={styles.price}>
        {offer.price}
        {offer.period && <span className={styles.period}>{offer.period}</span>}
      </p>
      <p className={styles.detail}>{offer.detail}</p>
    </>
  );
}

type PlanColumnProps = { plan: PlanPricing; allFeatures: string[]; offer: PlanOffer };

export function PlanColumn({ plan, allFeatures, offer }: PlanColumnProps) {
  const ctaLabel = plan.kind === 'free' ? pricingCopy.freeCta : pricingCopy.paidCta(plan.label);
  const ctaClass = plan.isHighlighted ? 'button-primary' : 'button-outline';

  return (
    <li className={styles.plan} data-highlighted={plan.isHighlighted || undefined}>
      <PlanSummary plan={plan} offer={offer} />
      <a href={offer.href} className={`button ${ctaClass} ${styles.cta}`}>
        {ctaLabel}
      </a>
      <FeatureList rows={featureRows(plan, allFeatures, offer.creditsLine)} />
    </li>
  );
}
