import { SectionHeading } from '@/components/section-heading';
import { pricingCopy } from '@/content/home';
import { loadPricing } from '@/lib/catalog';
import { PricingCalculator } from './pricing-calculator';

export async function Pricing() {
  const pricing = await loadPricing();
  return (
    <section id={pricingCopy.id} className="section" aria-labelledby={`${pricingCopy.id}-title`}>
      <div className="container">
        <PricingCalculator
          pricing={pricing}
          heading={<SectionHeading id={`${pricingCopy.id}-title`} title={pricingCopy.title} lede={pricingCopy.lede} />}
        />
      </div>
    </section>
  );
}
