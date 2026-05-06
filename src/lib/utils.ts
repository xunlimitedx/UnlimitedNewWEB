import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function calculateShipping(province: string, subtotal: number, weight?: number): number {
  if (subtotal >= 2500) return 0; // Free shipping threshold
  const baseCost: Record<string, number> = {
    'KwaZulu-Natal': 75,
    'Gauteng': 99,
    'Western Cape': 120,
    'Eastern Cape': 110,
    'Free State': 99,
    'Limpopo': 120,
    'Mpumalanga': 99,
    'North West': 110,
    'Northern Cape': 130,
  };
  const base = baseCost[province] || 120;
  const weightSurcharge = weight ? Math.ceil(weight / 5) * 15 : 0;
  return base + weightSurcharge;
}

export function getDiscountedPrice(price: number, quantity: number, tiers?: { minQty: number; discount: number }[]): number {
  if (!tiers || tiers.length === 0) return price;
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty);
  const applicable = sorted.find(t => quantity >= t.minQty);
  if (!applicable) return price;
  return price * (1 - applicable.discount / 100);
}

export const ADMIN_EMAILS = [
  'willemvangreunen6@gmail.com',
  'qa.admin@unlimitedits.co.za',
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', icon: 'Laptop' },
  { name: 'Desktops', slug: 'desktops', icon: 'Monitor' },
  { name: 'Components', slug: 'components', icon: 'Cpu' },
  { name: 'Peripherals', slug: 'peripherals', icon: 'Mouse' },
  { name: 'Networking', slug: 'networking', icon: 'Wifi' },
  { name: 'Storage', slug: 'storage', icon: 'HardDrive' },
  { name: 'Software', slug: 'software', icon: 'Code' },
  { name: 'Accessories', slug: 'accessories', icon: 'Headphones' },
];

export const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
];
