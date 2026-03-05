import { NextRequest, NextResponse } from 'next/server';
import { addDocument, getCollection } from '@/lib/firebase';
import { where } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { email, productId, productName } = await request.json();

    if (!email || !productId) {
      return NextResponse.json({ error: 'Email and product ID are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await getCollection('stockNotifications', [
      where('email', '==', email),
      where('productId', '==', productId),
      where('notified', '==', false),
    ]);

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'You are already subscribed to notifications for this product' });
    }

    await addDocument('stockNotifications', {
      email,
      productId,
      productName: productName || '',
      notified: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'You will be notified when this product is back in stock' });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
