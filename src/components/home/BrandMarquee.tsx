'use client';

const BRANDS = [
  'Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft',
  'Hikvision', 'Ubiquiti', 'TP-Link', 'MikroTik', 'Logitech',
  'Samsung', 'Kingston', 'Seagate', 'WD', 'Intel', 'AMD', 'NVIDIA',
];

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS]; // duplicate for seamless loop
  return (
    <section className="relative bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
          Authorised reseller &amp; service partner
        </p>
        <div className="relative marquee-pause [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee">
            {items.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="text-2xl md:text-3xl font-bold text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors tracking-tight"
                style={{ fontFamily: 'var(--font-heading), system-ui, sans-serif', letterSpacing: '-0.02em' }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
