import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAdminDb } from '@/lib/firebase-admin';
import ProductDetailClient from './ProductDetailClient';
import type { Product, Review } from '@/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Known brand list — used to auto-detect a brand from the product name when
// the supplier-provided `brand` field is missing or set to a supplier name.
const KNOWN_BRANDS = [
  'Apple','Samsung','Dell','HP','Lenovo','ASUS','Acer','MSI','Toshiba','LG','Sony','TCL',
  'Skyworth','Hisense','Panasonic','Philips','Microsoft','Logitech','Razer','Corsair','Kingston',
  'Seagate','WD','Western Digital','Sandisk','Intel','AMD','Nvidia','Gigabyte','Asrock',
  'Canon','Epson','Brother','Xerox','Ricoh','Kyocera',
  'Hikvision','Dahua','HiLook','Ezviz','Uniview','Intellinet','Manhattan',
  'TP-Link','D-Link','Mikrotik','Ubiquiti','Netgear','Mercusys','Tenda',
  'Mecer','Geeko','Rapoo','Promate','Volkano','Astrum','Casey','UniQue','XTOUCH',
  'Mellerware','Taurus','Defy','Russell Hobbs','Salton','Bennett Read',
  'Yankee Candle','Woodwick','Marlin','PlayStation','Xbox','Nintendo','Bose','JBL','Sennheiser',
];

function extractBrand(name: string | undefined, fallback: string | undefined): string | undefined {
  if (!name) return fallback;
  const upper = name.toUpperCase();
  // Prefer the longest brand name that appears as a whole word in the product name
  const matches = KNOWN_BRANDS.filter(b => new RegExp(`\\b${b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(name));
  if (matches.length) return matches.sort((a, b) => b.length - a.length)[0];
  return fallback;
}

// Fields that must NEVER be sent to the client (margin / supplier intelligence).
const SERVER_ONLY_PRODUCT_FIELDS = new Set([
  'costPrice','cost','wholesale','wholesalePrice','supplier','supplierSku','margin',
  'markup','markupType','markupValue','feedProvider','feedId','internalNotes','adminNotes',
]);

function sanitizeProduct(raw: Record<string, unknown> & { id: string; name?: string }): Product {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (SERVER_ONLY_PRODUCT_FIELDS.has(k)) continue;
    clean[k] = v;
  }
  // Replace supplier-as-brand with an extracted real brand when possible.
  const supplierName = (raw.supplier as string | undefined) || '';
  const rawBrand = (raw.brand as string | undefined) || '';
  const looksLikeSupplier = !!rawBrand && !!supplierName && rawBrand.toLowerCase() === supplierName.toLowerCase();
  if (!rawBrand || looksLikeSupplier) {
    const detected = extractBrand(raw.name as string | undefined, looksLikeSupplier ? undefined : rawBrand);
    if (detected) clean.brand = detected;
    else if (looksLikeSupplier) delete clean.brand;
  }
  return clean as unknown as Product;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return sanitizeProduct({ id: doc.id, ...(doc.data() as Record<string, unknown>) });
  } catch {
    return null;
  }
}

async function getReviews(productId: string): Promise<Review[]> {
  try {
    const db = getAdminDb();
    const snap = await db
      .collection('reviews')
      .where('productId', '==', productId)
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Product Not Found' };
  }

  const description =
    product.shortDescription ||
    product.description?.substring(0, 160) ||
    `Buy ${product.name} from Unlimited IT Solutions in Ramsgate, KZN.`;

  return {
    title: `${product.name} | Unlimited IT Solutions`,
    description,
    alternates: { canonical: `https://unlimitedits.co.za/products/${id}` },
    openGraph: {
      title: `${product.name} | Unlimited IT Solutions`,
      description,
      url: `https://unlimitedits.co.za/products/${id}`,
      type: 'website',
      images: product.images?.[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Unlimited IT Solutions`,
      description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [product, reviews] = await Promise.all([getProduct(id), getReviews(id)]);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} initialReviews={reviews} />;
}
