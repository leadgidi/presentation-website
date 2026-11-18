'use client';

import { ReactNode, useId, useState } from 'react';
import { pricingCopy } from '@/content/home';
import { BillingOption, DEFAULT_BILLING, DEFAULT_CREDITS, PricingData } from '@/content/pricing';
import { paidCreditsLine, planOffer } from '@/lib/pricing';
import { PlanColumn } from './plan-column';
import styles from './pricing-calculator.module.css';

type BillingSelectorProps = {
  options: BillingOption[];
  selected: BillingOption;
  onSelect: (option: BillingOption) => void;
};

function BillingSelector({ options, selected, onSelect }: BillingSelectorProps) {
  const name = useId();
  return (
    <fieldset className={styles.billing}>
      <legend className="visually-hidden">{pricingCopy.billingLegend}</legend>
      {options.map((option) => (
        <label key={option.id} className={styles.option}>
          <input type="radio" name={name} value={option.id} checked={option === selected} onChange={() => onSelect(option)} />
          <span>{option.label}</span>
          {option.saving && <span className={styles.saving}>{option.saving}</span>}
        </label>
      ))}
    </fieldset>
  );
}

type CreditSliderProps = { tiers: number[]; tierIndex: number; creditsLabel: string; onChange: (index: number) => void };

function CreditSlider({ tiers, tierIndex, creditsLabel, onChange }: CreditSliderProps) {
  const sliderId = useId();
  return (
    <div>
      <div className={styles.tier}>
        <label htmlFor={sliderId}>{pricingCopy.creditsLabel}</label>
        <output htmlFor={sliderId} className={styles.credits}>
          {creditsLabel}
        </output>
      </div>
      <input
        id={sliderId}
        className={styles.slider}
        type="range"
        min={0}
        max={tiers.length - 1}
        value={tierIndex}
        aria-valuetext={creditsLabel}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function useCreditSelection({ billingOptions, creditTiers }: PricingData) {
  const [billing, setBilling] = useState(
    () => billingOptions.find((option) => option.id === DEFAULT_BILLING) ?? billingOptions[0],
  );
  const [tierIndex, setTierIndex] = useState(() => Math.max(creditTiers.indexOf(DEFAULT_CREDITS), 0));
  const credits = creditTiers[tierIndex] * billing.creditMultiplier;
  return { billing, setBilling, tierIndex, setTierIndex, credits, creditsLine: paidCreditsLine(credits, billing) };
}

type PricingCalculatorProps = { pricing: PricingData; heading: ReactNode };

export function PricingCalculator({ pricing, heading }: PricingCalculatorProps) {
  const selection = useCreditSelection(pricing);

  return (
    <div className={`frame ${styles.frame}`}>
      <header className={`frame-head-centered ${styles.head}`}>
        {heading}
        <div className={styles.controls}>
          <BillingSelector options={pricing.billingOptions} selected={selection.billing} onSelect={selection.setBilling} />
          <CreditSlider
            tiers={pricing.creditTiers}
            tierIndex={selection.tierIndex}
            creditsLabel={selection.creditsLine}
            onChange={selection.setTierIndex}
          />
        </div>
      </header>
      <ul className={styles.plans}>
        {pricing.plans.map((plan) => (
          <PlanColumn
            key={plan.code}
            plan={plan}
            allFeatures={pricing.allFeatures}
            offer={planOffer(plan, selection.billing, selection.tierIndex, selection.credits)}
          />
        ))}
      </ul>
      <p className={styles.note}>{pricing.currencyNote}</p>
    </div>
  );
}
