const LOCALE = 'en-US';
const countFormatter = new Intl.NumberFormat(LOCALE);
const wholeUsd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const centsUsd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD', maximumFractionDigits: 3 });
const conjunction = new Intl.ListFormat(LOCALE, { type: 'conjunction' });

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatWholeUsd(value: number): string {
  return wholeUsd.format(value);
}

export function formatCentsUsd(value: number): string {
  return centsUsd.format(value);
}

export function formatList(items: string[]): string {
  return conjunction.format(items);
}
