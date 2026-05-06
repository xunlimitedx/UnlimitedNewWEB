/**
 * Post-order review request cron route.
 *
 * Runs daily. Finds orders delivered 7+ days ago that haven't yet had a review
 * request sent, and queues per-item review requests via `email-queue`.
 *
 * Companion: a Cloud Function `onWrite` trigger on `orders/{id}` could fire
 * this off the moment status flips to 'delivered' instead of running on a
 * schedule. See docs/CLOUD-FUNCTIONS.md (TODO).
 *
 * Auth: Bearer CRON_SECRET.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DAYS_AFTER_DELIVERY = 7;
const MAX_PER_RUN = 100;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminDb();
  const cutoff = new Date(Date.now() - DAYS_AFTER_DELIVERY * 24 * 60 * 60 * 1000);

  let scanned = 0;
  let queued = 0;

  try {
    const snap = await db
      .collection('orders')
      .where('status', '==', 'delivered')
      .where('deliveredAt', '<=', cutoff)
      .limit(MAX_PER_RUN)
      .get();

    for (const doc of snap.docs) {
      scanned++;
      const order = doc.data() as any;
      if (order.reviewRequestSentAt || !order.email) continue;

      await db.collection('email-queue').add({
        to: order.email,
        template: 'review-request',
        data: {
          firstName: order.shippingAddress?.firstName || '',
          orderId: doc.id,
          items: (order.items || []).map((it: any) => ({
            productId: it.productId,
            name: it.name,
            reviewUrl: `https://unlimitedits.co.za/products/${it.productId}#review`,
          })),
        },
        createdAt: new Date(),
        status: 'pending',
      });

      await doc.ref.update({ reviewRequestSentAt: new Date() });
      queued++;
    }

    return NextResponse.json({ ok: true, scanned, queued });
  } catch (err: any) {
    console.error('review-request cron error', err);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
