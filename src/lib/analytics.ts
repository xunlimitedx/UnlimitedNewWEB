// GA4 Enhanced E-commerce Events
// Usage: import { trackEvent } from '@/lib/analytics';

type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  item_brand?: string;
  price: number;
  quantity?: number;
  discount?: number;
};

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).gtag) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag(...args);
  }
}

export function trackViewItem(item: EcommerceItem) {
  gtag('event', 'view_item', {
    currency: 'ZAR',
    value: item.price,
    items: [item],
  });
}

export function trackAddToCart(item: EcommerceItem) {
  gtag('event', 'add_to_cart', {
    currency: 'ZAR',
    value: item.price * (item.quantity || 1),
    items: [item],
  });
}

export function trackRemoveFromCart(item: EcommerceItem) {
  gtag('event', 'remove_from_cart', {
    currency: 'ZAR',
    value: item.price * (item.quantity || 1),
    items: [item],
  });
}

export function trackViewCart(items: EcommerceItem[], value: number) {
  gtag('event', 'view_cart', { currency: 'ZAR', value, items });
}

export function trackBeginCheckout(items: EcommerceItem[], value: number, coupon?: string) {
  gtag('event', 'begin_checkout', { currency: 'ZAR', value, items, ...(coupon ? { coupon } : {}) });
}

export function trackPurchase(transactionId: string, items: EcommerceItem[], value: number, shipping: number, tax: number, coupon?: string) {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'ZAR',
    value,
    shipping,
    tax,
    items,
    ...(coupon ? { coupon } : {}),
  });
}

export function trackSearch(searchTerm: string) {
  gtag('event', 'search', { search_term: searchTerm });
}

export function trackAddToWishlist(item: EcommerceItem) {
  gtag('event', 'add_to_wishlist', { currency: 'ZAR', value: item.price, items: [item] });
}

export function trackShare(method: string, contentType: string, itemId: string) {
  gtag('event', 'share', { method, content_type: contentType, item_id: itemId });
}

export function trackSignUp(method: string) {
  gtag('event', 'sign_up', { method });
}

export function trackLogin(method: string) {
  gtag('event', 'login', { method });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  gtag('event', eventName, params);
}
