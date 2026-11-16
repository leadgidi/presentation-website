import { cache } from 'react';
import {
  billingDisplays,
  CatalogBilling,
  FreePlanPricing,
  DISPLAY_CURRENCY,
  currencyNote,
  PlanFeature,
  PaidTier,
  PlanPricing,
  PricingData,
  PublishedPlan,
  publishedPlans,
  savingLabel,
  HIDDEN_FEATURE_CODES,
  UPCOMING_FEATURE_CODES,
} from '@/content/pricing';
import { formatList } from './format';

const CATALOG_PATH = '/feapi/billing/catalog';
const CREDIT_ENTITLEMENT_KIND = 'CREDIT';

type CatalogProduct = { credits: number; priceId: string | null; currencyAmounts: Record<string, number> };

type CatalogEntitlement = { code: string; kind: string; label: string; sortOrder: number };

type CatalogPlan = {
  label: string;
  entitlements: CatalogEntitlement[];
  productsByBilling: Partial<Record<CatalogBilling, Record<string, CatalogProduct>>>;
};

type CatalogResponse = {
  currencySet: string[];
  creditOptions: number[];
  billingDiscountByCycle: Partial<Record<CatalogBilling, number>>;
  plans: Record<string, CatalogPlan>;
};

async function fetchCatalog(): Promise<CatalogResponse> {
  const apiUrl = process.env.CATALOG_API_URL;
  if (!apiUrl) throw new Error('CATALOG_API_URL is not set; the pricing section is built from the billing catalog.');
  const response = await fetch(`${apiUrl}${CATALOG_PATH}`, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Billing catalog request failed with HTTP ${response.status}.`);
  return assertCatalogShape(await response.json());
}

function assertCatalogShape(data: Partial<CatalogResponse>): CatalogResponse {
  const isValid = Array.isArray(data.currencySet) && Array.isArray(data.creditOptions) && typeof data.plans === 'object';
  if (!isValid) throw new Error('Billing catalog response is missing currencySet, creditOptions or plans.');
  return data as CatalogResponse;
}

function tierFor(plan: CatalogPlan, code: string, billing: CatalogBilling, credits: number): PaidTier {
  const product = plan.productsByBilling[billing]?.[String(credits)];
  const priceUsd = product?.currencyAmounts[DISPLAY_CURRENCY];
  if (!product?.priceId || priceUsd === undefined) {
    throw new Error(`Catalog has no ${DISPLAY_CURRENCY} price for ${code} ${billing} ${credits} credits.`);
  }
  return { priceUsd, priceId: product.priceId };
}

function toFeatures(plan: CatalogPlan): PlanFeature[] {
  return plan.entitlements
    .filter((entitlement) => entitlement.kind !== CREDIT_ENTITLEMENT_KIND && !HIDDEN_FEATURE_CODES.includes(entitlement.code))
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((entitlement) => ({ label: entitlement.label, isUpcoming: UPCOMING_FEATURE_CODES.includes(entitlement.code) }));
}

function freeCredits(plan: CatalogPlan, code: string): number {
  const product = Object.values(plan.productsByBilling).flatMap((products) => Object.values(products ?? {}))[0];
  if (!product) throw new Error(`Catalog has no product for the free plan ${code}.`);
  return product.credits;
}

function toPlanPricing(catalog: CatalogResponse, published: PublishedPlan): PlanPricing {
  const plan = catalog.plans[published.code];
  if (!plan) throw new Error(`Catalog has no plan ${published.code}.`);
  const common = {
    code: published.code,
    label: plan.label,
    tagline: published.tagline,
    isHighlighted: published.isHighlighted,
    features: toFeatures(plan),
  };
  if (published.isFree) return { ...common, kind: 'free', credits: freeCredits(plan, published.code) };
  const tiersFor = (billing: CatalogBilling) =>
    catalog.creditOptions.map((credits) => tierFor(plan, published.code, billing, credits));
  return {
    ...common,
    kind: 'paid',
    tiersByBilling: Object.fromEntries(billingDisplays.map(({ id }) => [id, tiersFor(id)])) as Record<CatalogBilling, PaidTier[]>,
  };
}

function formatCurrencyNote(currencySet: string[]): string {
  const others = currencySet.filter((currency) => currency !== DISPLAY_CURRENCY).map((currency) => currency.toUpperCase());
  const base = currencyNote.base(DISPLAY_CURRENCY.toUpperCase());
  return others.length === 0 ? base : `${base} ${currencyNote.others(formatList(others))}`;
}

function freeCreditsOf(plans: PlanPricing[]): number {
  const freePlan = plans.find((plan): plan is FreePlanPricing => plan.kind === 'free');
  if (!freePlan) throw new Error('Catalog pricing has no free plan.');
  return freePlan.credits;
}

async function buildPricing(): Promise<PricingData> {
  const catalog = await fetchCatalog();
  const plans = publishedPlans.map((published) => toPlanPricing(catalog, published));
  return {
    creditTiers: catalog.creditOptions,
    allFeatures: [...new Set(plans.flatMap((plan) => plan.features.map((feature) => feature.label)))],
    freeCredits: freeCreditsOf(plans),
    billingOptions: billingDisplays.map((display) => {
      const percent = catalog.billingDiscountByCycle[display.id] ?? 0;
      return { ...display, saving: percent > 0 ? savingLabel(percent) : '' };
    }),
    plans,
    currencyNote: formatCurrencyNote(catalog.currencySet),
  };
}

export const loadPricing = cache(buildPricing);
