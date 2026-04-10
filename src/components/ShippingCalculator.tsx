'use client';

import React, { useState } from 'react';
import { formatCurrency, calculateShipping, PROVINCES } from '@/lib/utils';
import { Truck, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui';

interface ShippingCalculatorProps {
  subtotal: number;
  weight?: number;
}

export default function ShippingCalculator({ subtotal, weight }: ShippingCalculatorProps) {
  const [province, setProvince] = useState('');
  const [calculated, setCalculated] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!province) return;
    const cost = calculateShipping(province, subtotal, weight);
    setCalculated(cost);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
        <Truck className="w-4 h-4 text-primary-600" />
        Shipping Estimate
      </h3>
      <div className="flex gap-2">
        <select
          value={province}
          onChange={(e) => { setProvince(e.target.value); setCalculated(null); }}
          className="flex-1 h-9 px-3 text-sm border rounded-lg bg-white"
        >
          <option value="">Select Province</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <Button size="sm" onClick={handleCalculate} disabled={!province}>
          Calculate
        </Button>
      </div>
      {calculated !== null && (
        <div className="mt-3 flex items-center gap-2">
          {calculated === 0 ? (
            <p className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Package className="w-4 h-4" /> Free shipping!
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              Estimated shipping: <span className="font-semibold">{formatCurrency(calculated)}</span>
            </p>
          )}
        </div>
      )}
      {subtotal < 2500 && (
        <p className="text-xs text-gray-400 mt-2">
          Free shipping on orders over {formatCurrency(2500)}
        </p>
      )}
    </div>
  );
}
