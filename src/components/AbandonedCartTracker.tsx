'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

/**
 * AbandonedCartTracker saves cart state to Firestore when the user has items
 * and is authenticated. The admin can later query abandoned carts (items present
 * but no matching order within a time window) and send recovery emails.
 */
export default function AbandonedCartTracker() {
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user || items.length === 0) return;

    // Debounce: only save after 5 seconds of inactivity
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const subtotal = items.reduce((t, i) => t + i.price * i.quantity, 0);
        await setDoc(doc(db, 'abandoned-carts', user.uid), {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            sku: i.sku,
          })),
          subtotal,
          itemCount: items.length,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch {
        // Silently fail - non-critical
      }
    }, 5000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user, items]);

  // Clear abandoned cart on successful checkout (listen for empty cart)
  useEffect(() => {
    if (!user || items.length > 0) return;
    const clearAbandonedCart = async () => {
      try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'abandoned-carts', user.uid));
      } catch {
        // Silently fail
      }
    };
    clearAbandonedCart();
  }, [user, items.length]);

  return null;
}
