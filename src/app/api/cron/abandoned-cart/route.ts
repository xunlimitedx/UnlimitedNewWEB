/**
 * Abandoned-cart recovery cron route.
 *
 * Triggered by Cloud Scheduler / Vercel Cron daily. Scans `carts` collection for
 * carts last updated 24h-72h ago that have not been converted to an order, and
 * queues a reminder email via the `email-queue` Firestore collection (consumed
 * by an extension or Cloud Function — wire up SendGrid / Postmark trigger
 * separately).
 *
 * Security: requires `Authorization: Bearer ${CRON_SECRET}` header. Set the
 * env var in deployment; if missing the route is disabled.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WINDOW_START_HOURS = 24;
const WINDOW_END_HOURS = 72;
const MAX_REMINDERS = 200;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }
  const auth = req.headers.get('authorization') || '';
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminDb();
  const now = Date.now();
  const startCutoff = new Date(now - WINDOW_END_HOURS * 60 * 60 * 1000);
  const endCutoff = new Date(now - WINDOW_START_HOURS * 60 * 60 * 1000);

  let scanned = 0;
  let queued = 0;
  let skipped = 0;

  try {
    const snap = await db
      .collection('carts')
      .where('updatedAt', '>=', startCutoff)
      .where('updatedAt', '<=', endCutoff)
      .limit(MAX_REMINDERS)
      .get();

    for (const doc of snap.docs) {
      scanned++;
      const cart = doc.data() as any;
      if (!cart.email || !cart.items?.length) {
        skipped++;
        continue;
      }
      if (cart.reminderSentAt) {
        skipped++;
        continue;
      }

      await db.collection('email-queue').add({
        to: cart.email,
        template: 'abandoned-cart',
        data: {
          firstName: cart.firstName || '',
          itemCount: cart.items.length,
          subtotal: cart.subtotal || 0,
          recoverUrl: `https://unlimitedits.co.za/cart?recover=${doc.id}`,
        },
        createdAt: new Date(),
        status: 'pending',
      });
      await doc.ref.update({ reminderSentAt: new Date() });
      queued++;
    }

    return NextResponse.json({ ok: true, scanned, queued, skipped });
  } catch (err: any) {
    console.error('abandoned-cart cron error', err);
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
