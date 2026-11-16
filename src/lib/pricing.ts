import { pricingCopy } from '@/content/home';
import { BillingOption, DISPLAY_CURRENCY, PlanPricing } from '@/content/pricing';
import { site } from '@/content/site';
import { formatCentsUsd, formatCount, formatWholeUsd } from './format';

export type PlanOffer = { price: string; period: string; detail: string; creditsLine: string; href: string };

function checkoutUrl(priceId: string): string {
  const checkout = `${site.checkout.path}?${new URLSearchParams({ priceId, currency: DISPLAY_CURRENCY })}`;
  return `${site.signupUrl}?${new URLSearchParams({ [site.checkout.returnParam]: checkout })}`;
}

export function paidCreditsLine(credits: number, billing: BillingOption): string {
  return `${formatCount(credits)} ${pricingCopy.creditsIncluded}${billing.period}`;
}

export function planOffer(plan: PlanPricing, billing: BillingOption, tierIndex: number, credits: number): PlanOffer {
  if (plan.kind === 'free') {
    const creditsLine = `${formatCount(plan.credits)} ${pricingCopy.freeCreditsSuffix}`;
    return { price: pricingCopy.freePrice, period: '', detail: creditsLine, creditsLine, href: site.signupUrl };
  }
  const { priceUsd, priceId } = plan.tiersByBilling[billing.id][tierIndex];
  return {
    price: formatWholeUsd(priceUsd),
    period: billing.period,
    detail: `${formatCentsUsd(priceUsd / credits)} ${pricingCopy.perContact}`,
    creditsLine: paidCreditsLine(credits, billing),
    href: checkoutUrl(priceId),
  };
}
