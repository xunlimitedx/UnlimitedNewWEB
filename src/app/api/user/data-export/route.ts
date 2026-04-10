import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

// POPIA: Allow users to export their personal data
export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    
    // Gather all user data
    const [
      userDoc,
      ordersSnap,
      reviewsSnap,
      wishlistSnap,
      alertsSnap,
      questionsSnap,
    ] = await Promise.all([
      db.collection('users').doc(userId).get(),
      db.collection('orders').where('userId', '==', userId).get(),
      db.collection('reviews').where('userId', '==', userId).get(),
      db.collection('wishlist').where('userId', '==', userId).get(),
      db.collection('price-alerts').where('userId', '==', userId).get(),
      db.collection('product-questions').where('userId', '==', userId).get(),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      exportedFor: userId,
      profile: userDoc.exists ? userDoc.data() : null,
      orders: ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      reviews: reviewsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      wishlist: wishlistSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      priceAlerts: alertsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      questions: questionsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="popia-data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error('POPIA data export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
