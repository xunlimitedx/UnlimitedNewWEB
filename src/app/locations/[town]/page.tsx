import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';

type TownKey = 'ramsgate' | 'margate' | 'port-shepstone' | 'hibberdene' | 'scottburgh';

const TOWNS: Record<TownKey, { name: string; region: string; copy: string; postal: string; lat: number; lng: number }> = {
  ramsgate: { name: 'Ramsgate', region: 'KZN South Coast', postal: '4285', lat: -30.8896, lng: 30.3398, copy: 'Our HQ in Ramsgate serves walk-in customers across the KZN South Coast with same-day collection and on-site IT support.' },
  margate: { name: 'Margate', region: 'KZN South Coast', postal: '4275', lat: -30.8642, lng: 30.3697, copy: 'IT supplies, repairs and CCTV installation across Margate, Uvongo and Shelly Beach. Same-day delivery from our Ramsgate branch.' },
  'port-shepstone': { name: 'Port Shepstone', region: 'KZN South Coast', postal: '4240', lat: -30.7411, lng: 30.4546, copy: 'Business IT supplies, networking and on-site computer repairs for Port Shepstone, Oslo Beach and Marburg.' },
  hibberdene: { name: 'Hibberdene', region: 'KZN South Coast', postal: '4220', lat: -30.5742, lng: 30.5731, copy: 'Reliable IT support, laptop repairs and security cameras for Hibberdene, Pumula and Umzumbe.' },
  scottburgh: { name: 'Scottburgh', region: 'KZN South Coast', postal: '4180', lat: -30.2857, lng: 30.7530, copy: 'IT hardware, fibre and networking for Scottburgh, Park Rynie and Pennington — South Coast delivery available.' },
};

export async function generateStaticParams() {
  return Object.keys(TOWNS).map((town) => ({ town }));
}

export async function generateMetadata({ params }: { params: Promise<{ town: string }> }): Promise<Metadata> {
  const { town } = await params;
  const data = TOWNS[town as TownKey];
  if (!data) return {};
  const title = `IT Supplies, Repairs & CCTV in ${data.name} | Unlimited IT Solutions`;
  const description = `${data.copy} Computer repairs, networking, CCTV, business IT — call 082 556 9875.`;
  return {
    title,
    description,
    alternates: { canonical: `https://unlimitedits.co.za/locations/${town}` },
    openGraph: { title, description, url: `https://unlimitedits.co.za/locations/${town}` },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ town: string }> }) {
  const { town } = await params;
  const data = TOWNS[town as TownKey];
  if (!data) notFound();

  const services = [
    { title: 'Computer & Laptop Repairs', href: '/services/computer-repairs' },
    { title: 'CCTV Installation', href: '/services/cctv-installation' },
    { title: 'Networking & Fibre', href: '/services/networking' },
    { title: 'Console Repairs', href: '/services/console-repairs' },
    { title: 'Mac Repairs', href: '/services/mac-repairs' },
  ];

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Unlimited IT Solutions — ${data.name}`,
    image: 'https://unlimitedits.co.za/images/logo.png',
    description: data.copy,
    telephone: '+27825569875',
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.name,
      addressRegion: 'KwaZulu-Natal',
      postalCode: data.postal,
      addressCountry: 'ZA',
    },
    geo: { '@type': 'GeoCoordinates', latitude: data.lat, longitude: data.lng },
    areaServed: data.region,
    url: `https://unlimitedits.co.za/locations/${town}`,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 text-primary-600 mb-3">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">{data.region}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            IT Supplies & Repairs in {data.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">{data.copy}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Phone className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Call us</h3>
            <a href="tel:+27825569875" className="text-primary-600 hover:underline">082 556 9875</a>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Clock className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Same-day collection</h3>
            <p className="text-sm text-gray-600">Order before 14:00 weekdays</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <CheckCircle2 className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold text-gray-900">12-month warranty</h3>
            <p className="text-sm text-gray-600">On all hardware sold</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Services available in {data.name}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {services.map((s) => (
            <Link key={s.href} href={s.href} className="block p-6 bg-white rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition">
              <span className="text-lg font-medium text-gray-900">{s.title}</span>
              <span className="block text-sm text-gray-500 mt-1">Available in {data.name} →</span>
            </Link>
          ))}
        </div>

        <div className="bg-primary-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Need IT help in {data.name}?</h2>
          <p className="mb-4 text-primary-50">Walk in, call, or shop online — we deliver across the South Coast.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:+27825569875" className="px-6 py-3 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-50">Call now</a>
            <Link href="/products" className="px-6 py-3 bg-primary-700 hover:bg-primary-800 rounded-lg font-medium">Shop products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
