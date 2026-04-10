// Product Types
export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number | null;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock?: number | null;
  images: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  featured?: boolean;
  active?: boolean;
  rating?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
  relatedProducts?: string[];
  weight?: number;
  bulkPricingTiers?: { minQty: number; discount: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage' | 'other';
  value: string;
  price?: number;
  stock?: number;
  sku?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  order: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful?: number;
  reported?: boolean;
  adminReply?: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface LoyaltyAccount {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  totalSpent: number;
  history: { date: string; points: number; description: string; type: 'earned' | 'redeemed' }[];
}

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  isActive: boolean;
  purchasedBy?: string;
  redeemedBy?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  notified: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

// User Types
export interface UserProfile {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  role?: string;
  addresses?: Address[];
  createdAt?: string;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
  couponCode?: string;
  loyaltyPointsUsed?: number;
  giftCardCode?: string;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  courier?: string;
  notes?: string;
  adminNotes?: string;
  timeline?: OrderEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderEvent {
  status: string;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
  variant?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  sku: string;
}

// Admin Types
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneAlt?: string;
  email?: string;
  phone?: string;
  address: string;
  businessHours: string;
  emails: {
    noReply: string;
    support: string;
    sales: string;
    info: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  currency: string;
  vatRate: number;
  shippingThreshold: number;
  taxRate?: number;
  freeShippingThreshold?: number;
}

export interface ShippingQuote {
  carrier: string;
  service: string;
  estimatedDays: number;
  price: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

// Data Feed Types
export interface FeedConfig {
  id: string;
  name: string;
  supplier: 'uboss' | 'esquire';
  url: string;
  enabled: boolean;
  markupType: 'percentage' | 'fixed';
  markupValue: number;
  lastSync?: string;
  lastSyncCount?: number;
  categoryFilter?: string[];
  excludeOutOfStock: boolean;
  excludeZeroPrice: boolean;
}

export interface FeedProduct {
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number | null;
  inStock: boolean;
  isActive: boolean;
  imageUrl: string;
  supplier: string;
  barcode?: string;
  lastUpdated?: string;
}

export interface FeedSyncResult {
  supplier: string;
  total: number;
  imported: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Payment Types
export interface PaymentSettings {
  payfast: {
    enabled: boolean;
    sandbox: boolean;
    merchantId: string;
    merchantKey: string;
    passphrase: string;
  };
  payflex: {
    enabled: boolean;
    sandbox: boolean;
    merchantId: string;
    apiKey: string;
  };
  eft: {
    enabled: boolean;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    reference: string;
  };
  cod: {
    enabled: boolean;
    surcharge: number;
    maxOrderAmount: number;
  };
}

// Email / SMTP Types
export interface EmailSettings {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    adminEmail: string;
    onNewSignup: boolean;
    onNewOrder: boolean;
    onPaymentReceived: boolean;
    onContactForm: boolean;
  };
}
