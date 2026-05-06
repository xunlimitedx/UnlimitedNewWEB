import { adminDb } from '@/lib/firebase-admin';
import { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

export const revalidate = 21600; // 6 hours

export const metadata: Metadata = {
  title: 'SA Tech Pricing Index | Unlimited IT Solutions',
  description: 'Live category pricing benchmarks for IT hardware in South Africa — laptops, monitors, networking, storage and more.',
  alternates: { canonical: 'https://unlimitedits.co.za/pricing-index' },
};

interface CategoryStat {
  category: string;
  count: number;
  min: number;
  max: number;
  avg: number;
}

async function loadStats(): Promise<CategoryStat[]> {
  try {
    const snap = await adminDb.collection('products').where('isActive', '==', true).select('category', 'price').get();
    const buckets = new Map<string, number[]>();
    snap.forEach((doc) => {
      const d = doc.data() as any;
      const cat = (d.category || 'uncategorised').toString();
      const price = Number(d.price);
      if (!isFinite(price) || price <= 0) return;
      if (!buckets.has(cat)) buckets.set(cat, []);
      buckets.get(cat)!.push(price);
    });
    const stats: CategoryStat[] = [];
    for (const [category, prices] of buckets.entries()) {
      if (prices.length < 3) continue;
      const sum = prices.reduce((a, b) => a + b, 0);
      stats.push({
        category,
        count: prices.length,
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: sum / prices.length,
      });
    }
    stats.sort((a, b) => b.count - a.count);
    return stats;
  } catch (err) {
    console.error('pricing-index load error', err);
    return [];
  }
}

const fmt = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`;

export default async function PricingIndexPage() {
  const stats = await loadStats();
  const updated = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-primary-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Live pricing data</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">SA Tech Pricing Index</h1>
          <p className="text-gray-600 mt-3 max-w-3xl">
            Category benchmarks across {stats.reduce((a, s) => a + s.count, 0).toLocaleString('en-ZA')} active SKUs in our South African catalogue. Updated {updated}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-right">SKUs</th>
                  <th className="px-4 py-3 font-medium text-right">From</th>
                  <th className="px-4 py-3 font-medium text-right">Average</th>
                  <th className="px-4 py-3 font-medium text-right">To</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((s) => (
                  <tr key={s.category} className="hover:bg-gray-50">
                    <td className="px-4 py-3 capitalize font-medium text-gray-900">{s.category}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{s.count.toLocaleString('en-ZA')}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(s.min)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(s.avg)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{fmt(s.max)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/products?category=${encodeURIComponent(s.category)}`} className="text-primary-600 hover:underline text-sm">Browse →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">Prices include VAT. Categories with fewer than 3 active SKUs are excluded.</p>
      </div>
    </div>
  );
}
