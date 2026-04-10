import { Metadata } from 'next';
import { getAdminDb } from '@/lib/firebase-admin';
import CategoryClient from './CategoryClient';

interface PageProps {
  params: Promise<{ category: string }>;
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  laptops: {
    title: 'Laptops',
    description: 'Browse our range of laptops from Dell, HP, Lenovo, Apple and more. Find the perfect laptop for work, gaming or everyday use.',
  },
  desktops: {
    title: 'Desktop Computers',
    description: 'Custom-built desktops, all-in-one PCs, and gaming rigs. Find the right desktop computer for your needs.',
  },
  accessories: {
    title: 'Computer Accessories',
    description: 'Keyboards, mice, headsets, webcams, cables and more. Essential accessories for your computer setup.',
  },
  networking: {
    title: 'Networking Equipment',
    description: 'Routers, switches, access points, and networking cables. Build a reliable network for your home or business.',
  },
  components: {
    title: 'PC Components',
    description: 'CPUs, GPUs, RAM, SSDs, motherboards and more. Upgrade or build your perfect PC.',
  },
  software: {
    title: 'Software',
    description: 'Operating systems, antivirus, productivity suites and business software. Licensed software from trusted publishers.',
  },
  printers: {
    title: 'Printers & Scanners',
    description: 'Inkjet, laser, and multifunction printers. Find the right printer for home or office use.',
  },
  surveillance: {
    title: 'CCTV & Surveillance',
    description: 'Security cameras, DVRs, NVRs, and complete CCTV systems for home and business security.',
  },
  gaming: {
    title: 'Gaming',
    description: 'Gaming laptops, consoles, controllers, and accessories. Level up your gaming experience.',
  },
  peripherals: {
    title: 'Peripherals',
    description: 'Monitors, keyboards, mice, speakers, and more peripherals for your workstation.',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const slug = decodeURIComponent(category).toLowerCase();
  const meta = CATEGORY_META[slug];

  return {
    title: meta?.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Products`,
    description: meta?.description || `Browse ${slug} products at Unlimited IT Solutions. Quality tech products with warranty.`,
    openGraph: {
      title: `${meta?.title || slug} | Unlimited IT Solutions`,
      description: meta?.description || `Browse ${slug} products`,
      url: `https://unlimitedits.co.za/products/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const slug = decodeURIComponent(category).toLowerCase();
  const meta = CATEGORY_META[slug];

  let products: any[] = [];
  try {
    const db = getAdminDb();
    const snap = await db.collection('products')
      .where('category', '==', slug)
      .where('isActive', '==', true)
      .get();
    products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    // Try case-insensitive match
    try {
      const db = getAdminDb();
      const snap = await db.collection('products').get();
      products = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p: any) =>
          p.category?.toLowerCase() === slug &&
          p.isActive !== false
        );
    } catch {}
  }

  return (
    <CategoryClient
      category={slug}
      title={meta?.title || slug.charAt(0).toUpperCase() + slug.slice(1)}
      description={meta?.description || ''}
      initialProducts={products}
    />
  );
}
