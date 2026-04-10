import { getAdminDb } from './firebase-admin';

export async function logAuditEvent(event: {
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
}) {
  try {
    const db = getAdminDb();
    await db.collection('audit-logs').add({
      ...event,
      details: event.details || '',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log audit event:', err);
  }
}

export type AuditAction =
  | 'product.create'
  | 'product.update'
  | 'product.delete'
  | 'order.status_change'
  | 'order.update'
  | 'coupon.create'
  | 'coupon.update'
  | 'coupon.delete'
  | 'settings.update'
  | 'theme.update'
  | 'blog.create'
  | 'blog.update'
  | 'blog.delete'
  | 'review.approve'
  | 'review.reject'
  | 'customer.update'
  | 'feed.sync'
  | 'import.run';
