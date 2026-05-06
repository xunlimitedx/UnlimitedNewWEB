/**
 * Shared pricing logic for supplier feeds.
 * Markup is applied first, then a rounding rule snaps the result to a
 * "psychological" price ending (e.g. R123.99 → R149, R163 → R199).
 */

export type MarkupType = 'percentage' | 'fixed';

export type RoundingRule =
  | 'none'           // No rounding (just 2-decimal cents)
  | 'up_9'           // Round UP to next number ending in 9   (R123 → R129, R163 → R169)
  | 'up_49_99'       // Round UP to next 49 or 99             (R123 → R149, R163 → R199) ★ default
  | 'up_99'          // Round UP to next number ending in 99  (R123 → R199, R163 → R199)
  | 'up_95'          // Round UP to next number ending in 95  (R123 → R195, R163 → R195)
  | 'nearest_50'     // Round to nearest 50                   (R123 → R150, R163 → R150)
  | 'nearest_100'    // Round to nearest 100                  (R123 → R100, R163 → R200)
  | 'psych_99c';     // Force .99 ending  (R123 → R122.99, R150 → R149.99)

export interface PricingConfig {
  markupType: MarkupType;
  markupValue: number;
  rounding?: RoundingRule;
}

export function applyMarkup(
  costPrice: number,
  markupType: MarkupType,
  markupValue: number
): number {
  if (!Number.isFinite(costPrice) || costPrice <= 0) return 0;
  if (markupType === 'percentage') {
    return costPrice * (1 + (markupValue || 0) / 100);
  }
  return costPrice + (markupValue || 0);
}

export function applyRounding(price: number, rule: RoundingRule = 'none'): number {
  if (!Number.isFinite(price) || price <= 0) return 0;

  switch (rule) {
    case 'up_9': {
      const ceil = Math.ceil(price);
      const m = ceil % 10;
      return ceil + ((9 - m + 10) % 10);
    }
    case 'up_49_99': {
      const ceil = Math.ceil(price);
      const m = ceil % 100;
      if (m === 49 || m === 99) return ceil;
      if (m < 49) return ceil + (49 - m);
      if (m < 99) return ceil + (99 - m);
      return ceil + (149 - m); // m === 100? unreachable with %100, kept for safety
    }
    case 'up_99': {
      const ceil = Math.ceil(price);
      const m = ceil % 100;
      if (m === 99) return ceil;
      if (m < 99) return ceil + (99 - m);
      return ceil + (199 - m);
    }
    case 'up_95': {
      const ceil = Math.ceil(price);
      const m = ceil % 100;
      if (m === 95) return ceil;
      if (m < 95) return ceil + (95 - m);
      return ceil + (195 - m);
    }
    case 'nearest_50':
      return Math.round(price / 50) * 50;
    case 'nearest_100':
      return Math.round(price / 100) * 100;
    case 'psych_99c': {
      const floor = Math.floor(price);
      // Always end in .99 — bump to next whole if already whole
      return (price === floor ? floor - 1 : floor) + 0.99;
    }
    case 'none':
    default:
      return Math.round(price * 100) / 100;
  }
}

export function calculateSellingPrice(
  costPrice: number,
  config: PricingConfig
): number {
  const marked = applyMarkup(costPrice, config.markupType, config.markupValue);
  return applyRounding(marked, config.rounding || 'none');
}

export const ROUNDING_OPTIONS: Array<{ value: RoundingRule; label: string; example: string }> = [
  { value: 'none',         label: 'No rounding',                 example: 'R123.45 stays R123.45' },
  { value: 'up_9',         label: 'Round up to ending in 9',     example: 'R123 → R129' },
  { value: 'up_49_99',     label: 'Round up to 49 or 99',        example: 'R123 → R149, R163 → R199' },
  { value: 'up_99',        label: 'Round up to ending in 99',    example: 'R123 → R199' },
  { value: 'up_95',        label: 'Round up to ending in 95',    example: 'R123 → R195' },
  { value: 'nearest_50',   label: 'Nearest R50',                 example: 'R123 → R150, R163 → R150' },
  { value: 'nearest_100',  label: 'Nearest R100',                example: 'R123 → R100, R163 → R200' },
  { value: 'psych_99c',    label: 'Force .99 cents',             example: 'R123 → R122.99' },
];
