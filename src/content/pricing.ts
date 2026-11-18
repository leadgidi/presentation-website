export type CatalogBilling = 'one_time' | 'monthly' | 'yearly';

export type BillingOption = {
  id: CatalogBilling;
  label: string;
  period: string;
  creditMultiplier: number;
  saving: string;
};

export type PlanFeature = { label: string; isUpcoming: boolean };

type PlanBase = { code: string; label: string; tagline: string; isHighlighted: boolean; features: PlanFeature[] };

export type PaidTier = { priceUsd: number; priceId: string };

type PaidPlanPricing = PlanBase & { kind: 'paid'; tiersByBilling: Record<CatalogBilling, PaidTier[]> };

export type FreePlanPricing = PlanBase & { kind: 'free'; credits: number };

export type PlanPricing = FreePlanPricing | PaidPlanPricing;

export type PricingData = {
  creditTiers: number[];
  allFeatures: string[];
  freeCredits: number;
  billingOptions: BillingOption[];
  plans: PlanPricing[];
  currencyNote: string;
};

export type PublishedPlan = { code: string; tagline: string; isFree: boolean; isHighlighted: boolean };

export const DISPLAY_CURRENCY = 'usd';

export const DEFAULT_BILLING: CatalogBilling = 'monthly';
export const DEFAULT_CREDITS = 1000;

export const publishedPlans: PublishedPlan[] = [
  { code: 'free-plan', tagline: 'Try it on your own list.', isFree: true, isHighlighted: false },
  { code: 'starter', tagline: 'Buy credits once or subscribe and save.', isFree: false, isHighlighted: true },
  { code: 'business', tagline: 'Everything in Starter. Team accounts are coming soon.', isFree: false, isHighlighted: false },
];

// Teams is seeded on Business but not enforced by the backend, so it shows as upcoming.
export const UPCOMING_FEATURE_CODES = ['teams'];

// LinkedIn URLs are already returned on every plan, so listing this as a Business extra would mislead.
export const HIDDEN_FEATURE_CODES = ['linkedin_return'];

export const billingDisplays: Omit<BillingOption, 'saving'>[] = [
  { id: 'one_time', label: 'One-time', period: '', creditMultiplier: 1 },
  { id: 'monthly', label: 'Monthly', period: '/month', creditMultiplier: 1 },
  { id: 'yearly', label: 'Yearly', period: '/year', creditMultiplier: 12 },
];

export const savingLabel = (percent: number) => `Save ${percent}%`;

export const currencyNote = {
  base: (currency: string) => `Prices in ${currency}.`,
  others: (currencies: string) => `${currencies} are available at checkout.`,
};
