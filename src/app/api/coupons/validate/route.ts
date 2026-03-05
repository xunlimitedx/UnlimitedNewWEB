import { NextRequest, NextResponse } from 'next/server';
import { getCollection, updateDocument } from '@/lib/firebase';
import { where } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const coupons = await getCollection('coupons', [
      where('code', '==', code.trim().toUpperCase()),
    ]);

    if (!coupons || coupons.length === 0) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    const coupon = coupons[0] as unknown as {
      id: string;
      code: string;
      discountType: 'percentage' | 'fixed';
      discountValue: number;
      minOrderAmount: number;
      maxUses: number;
      usedCount: number;
      expiresAt: string | null;
      isActive: boolean;
    };

    if (!coupon.isActive) {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order amount of R${coupon.minOrderAmount.toFixed(2)} required` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round(subtotal * (coupon.discountValue / 100) * 100) / 100;
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
