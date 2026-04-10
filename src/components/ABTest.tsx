'use client';

import React, { useEffect, useMemo, useRef } from 'react';

interface ABTestProps {
  experimentId: string;
  variants: React.ReactNode[];
  /** Optional weights (must sum to 1). Default: equal distribution */
  weights?: number[];
}

function getExperimentVariant(experimentId: string, numVariants: number, weights?: number[]): number {
  if (typeof window === 'undefined') return 0;

  // Check if user already has a variant assigned
  const storageKey = `ab-${experimentId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored !== null) {
    const idx = parseInt(stored, 10);
    if (idx >= 0 && idx < numVariants) return idx;
  }

  // Assign variant
  let variant = 0;
  if (weights && weights.length === numVariants) {
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (rand <= cumulative) {
        variant = i;
        break;
      }
    }
  } else {
    variant = Math.floor(Math.random() * numVariants);
  }

  localStorage.setItem(storageKey, String(variant));
  return variant;
}

/**
 * ABTest component: Renders one of the provided variants based on
 * a deterministic assignment per user (stored in localStorage).
 * Tracks the impression to GA4 as a custom event.
 */
export default function ABTest({ experimentId, variants, weights }: ABTestProps) {
  const variantIndex = useMemo(
    () => getExperimentVariant(experimentId, variants.length, weights),
    [experimentId, variants.length]
  );
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Track experiment impression
    try {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.gtag === 'function') {
        (w.gtag as (...args: unknown[]) => void)('event', 'experiment_impression', {
          experiment_id: experimentId,
          variant_id: `variant_${variantIndex}`,
        });
      }
    } catch {}
  }, [experimentId, variantIndex]);

  return <>{variants[variantIndex]}</>;
}

/**
 * Hook to get the variant index for an experiment
 */
export function useABTest(experimentId: string, numVariants: number = 2, weights?: number[]): number {
  return useMemo(
    () => getExperimentVariant(experimentId, numVariants, weights),
    [experimentId, numVariants]
  );
}
