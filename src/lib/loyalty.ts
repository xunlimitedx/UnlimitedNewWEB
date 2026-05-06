/**
 * Loyalty points helpers.
 *
 * Points model: 1 point per R10 spent (paid orders only). Redemption rate:
 * 100 points = R10 off (rate stored in settings/loyalty.redeemRate).
 *
 * Storage: users/{uid}/loyalty/{auto} ledger entries with positive (earn) or
 * negative (redeem) amounts; users/{uid}.loyaltyBalance maintained as a
 * denormalised running total for fast reads.
 *
 * Wire-up:
 *   - Call `awardOrderPoints(orderId)` from your payment-success handler
 *     (e.g. src/app/api/payments/payfast-itn/route.ts) AFTER paymentStatus
 *     flips to 'paid'.
 *   - Call `redeemPoints(uid, points, orderId)` at checkout when the customer
 *     applies a loyalty redemption.
 */
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POINTS_PER_RAND = 0.1; // 1 point per R10
export const REDEEM_RATE = 0.1;     // 100 points = R10

export async function awardOrderPoints(orderId: string): Promise<{ awarded: number } | { skipped: string }> {
  const db = getAdminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) return { skipped: 'order-missing' };
  const order = orderSnap.data() as any;

  if (order.paymentStatus !== 'paid') return { skipped: 'not-paid' };
  if (order.loyaltyAwardedAt) return { skipped: 'already-awarded' };
  if (!order.userId) return { skipped: 'guest-order' };

  const points = Math.floor((order.total || 0) * POINTS_PER_RAND);
  if (points <= 0) return { skipped: 'zero-points' };

  const userRef = db.collection('users').doc(order.userId);
  await db.runTransaction(async (tx) => {
    tx.update(orderRef, { loyaltyAwardedAt: new Date(), loyaltyAwarded: points });
    tx.update(userRef, { loyaltyBalance: FieldValue.increment(points) });
    tx.set(userRef.collection('loyalty').doc(), {
      type: 'earn',
      points,
      orderId,
      createdAt: new Date(),
    });
  });

  return { awarded: points };
}

export async function redeemPoints(userId: string, points: number, orderId: string): Promise<void> {
  if (points <= 0) throw new Error('Invalid points amount');
  const db = getAdminDb();
  const userRef = db.collection('users').doc(userId);

  await db.runTransaction(async (tx) => {
    const userSnap = await tx.get(userRef);
    const balance = (userSnap.data()?.loyaltyBalance as number) || 0;
    if (balance < points) throw new Error('Insufficient loyalty balance');
    tx.update(userRef, { loyaltyBalance: FieldValue.increment(-points) });
    tx.set(userRef.collection('loyalty').doc(), {
      type: 'redeem',
      points: -points,
      orderId,
      createdAt: new Date(),
    });
  });
}

export function pointsToRand(points: number): number {
  return points * REDEEM_RATE;
}

export function randToPoints(rand: number): number {
  return Math.floor(rand / REDEEM_RATE);
}
