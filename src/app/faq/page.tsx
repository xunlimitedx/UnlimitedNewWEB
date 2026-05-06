import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpCircle, Wrench, Cpu, Truck, ShieldCheck, UserCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ — Computer Repairs, IT Services & CCTV Questions | Ramsgate',
  description:
    'Frequently asked questions about computer repairs, Mac repairs, CCTV installations, console repairs, networking, IT support, and online orders at Unlimited IT Solutions, Ramsgate.',
  alternates: {
    canonical: 'https://unlimitedits.co.za/faq',
  },
  openGraph: {
    title: 'FAQ | Unlimited IT Solutions',
    description: 'Answers to common questions about our repairs, IT services, CCTV, and online shop.',
  },
};

const faqs = [
  {
    category: 'Repairs & Services',
    items: [
      {
        q: 'What types of computers do you repair?',
        a: 'We repair all major brands including Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba, and Apple Mac. This covers desktops, laptops, and all-in-one PCs — both hardware and software issues.',
      },
      {
        q: 'Do you repair gaming consoles?',
        a: 'Yes! We repair PlayStation, Xbox, and Nintendo consoles. Common repairs include HDMI port replacement, overheating fixes, disc drive repairs, and controller issues.',
      },
      {
        q: 'Do you repair Apple Mac computers?',
        a: 'Absolutely. We service MacBooks, iMacs, Mac Minis, and Mac Pros — including logic board repairs, screen replacements, battery swaps, and software troubleshooting.',
      },
      {
        q: 'What is fine soldering?',
        a: 'Fine soldering (micro-soldering) is precision work on tiny components like USB-C ports, GPU chips, capacitors, and connectors on motherboards. Our technicians use specialist equipment for this delicate work.',
      },
      {
        q: 'Do you install CCTV systems?',
        a: 'Yes, we design, install, and maintain CCTV systems for homes and businesses. This includes IP cameras, DVR/NVR setup, remote viewing on your phone, and integration with existing security systems.',
      },
      {
        q: 'Can you set up networking for my business?',
        a: 'We provide full network solutions — structured cabling, Wi-Fi design, router and switch configuration, VPN setup, and enterprise-grade networking for offices and commercial premises.',
      },
      {
        q: 'Do you offer remote support?',
        a: 'Yes, we offer secure remote support nationwide. Our technicians can connect to your computer remotely to diagnose and fix software issues, install updates, and more.',
      },
      {
        q: 'Do you do on-site callouts?',
        a: 'Yes. Our technicians provide on-site support across the KZN South Coast for installations, network setups, CCTV work, server maintenance, and troubleshooting.',
      },
    ],
  },
  {
    category: 'Software & Licensing',
    items: [
      {
        q: 'Are you an authorised software reseller?',
        a: 'Yes, we are a certified reseller for Adobe products (Acrobat, Photoshop, Creative Cloud), Microsoft (Windows, Office, Microsoft 365), and antivirus software (Norton, McAfee, Kaspersky, Bitdefender, Avast).',
      },
      {
        q: 'Can you help with virus removal?',
        a: 'Yes. We provide thorough virus and malware removal, followed by security software installation and system hardening to prevent future infections.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery within South Africa takes 3–5 business days. Express options are available at checkout for 1–2 day delivery to major cities.',
      },
      {
        q: 'Do you offer free shipping?',
        a: 'Yes! Orders over R2,500 qualify for free standard shipping anywhere in South Africa.',
      },
      {
        q: 'Can I track my order?',
        a: "Absolutely. Once your order is dispatched, you'll receive a tracking number via email. You can also check your order status in your account dashboard.",
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit cards, debit cards, EFT, and cash payments at our Ramsgate shop. All online transactions are processed through secure, PCI-compliant payment gateways.',
      },
    ],
  },
  {
    category: 'Returns & Warranty',
    items: [
      {
        q: 'What is your return policy?',
        a: 'In line with the Consumer Protection Act, you may return goods within 7 days of delivery for a full refund, provided items are in original condition and packaging. Contact support@unlimitedits.co.za to initiate a return.',
      },
      {
        q: 'What warranty do your products carry?',
        a: 'All products carry the standard manufacturer warranty, typically 1–3 years depending on the brand and product type. Extended warranty options are available on select items.',
      },
      {
        q: 'What if I receive a defective product?',
        a: "Contact us immediately at support@unlimitedits.co.za. We'll arrange a replacement or repair under warranty at no additional cost.",
      },
    ],
  },
  {
    category: 'Account & Security',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign Up" at the top of the page. You can register with your email or sign in with Google for quick access.',
      },
      {
        q: 'Is my personal information safe?',
        a: 'Yes. We comply with POPIA (Protection of Personal Information Act) and use industry-standard encryption to protect your data. Read our Privacy Policy for details.',
      },
    ],
  },
];

// Flatten all FAQ items for JSON-LD
const allFaqItems = faqs.flatMap((section) => section.items);

function FaqJsonLd() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default function FAQPage() {
  const categoryMeta: Record<string, { icon: any; tile: string }> = {
    'Repairs & Services':  { icon: Wrench,      tile: 'from-blue-500 to-cyan-500' },
    'Software & Licensing':{ icon: Cpu,         tile: 'from-violet-500 to-fuchsia-500' },
    'Orders & Shipping':   { icon: Truck,       tile: 'from-amber-500 to-orange-500' },
    'Returns & Warranty':  { icon: ShieldCheck, tile: 'from-emerald-500 to-teal-500' },
    'Account & Security':  { icon: UserCircle,  tile: 'from-rose-500 to-pink-500' },
  };
  return (
    <div>
      <FaqJsonLd />
      {/* Aurora Hero */}
      <section className="relative isolate overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 animate-aurora opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-[28rem] h-[28rem] rounded-full bg-blue-500/25 blur-3xl animate-orb pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <span className="eyebrow-chip mx-auto"><HelpCircle className="w-3.5 h-3.5" /> Help centre</span>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.98]">
            Questions, <span className="text-gradient-premium">answered.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our repairs, services, shipping and warranty — straight from the workshop.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {faqs.map((section) => {
            const meta = categoryMeta[section.category] || { icon: HelpCircle, tile: 'from-primary-500 to-blue-600' };
            const Icon = meta.icon;
            return (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <span className={`flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${meta.tile} text-white shadow-lg shadow-black/5 ring-1 ring-white/30`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {section.category}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details
                      key={faq.q}
                      className="group card-premium overflow-hidden transition-all hover:shadow-md"
                    >
                      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer font-semibold text-gray-900 dark:text-white tracking-tight list-none [&::-webkit-details-marker]:hidden hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <span>{faq.q}</span>
                        <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${meta.tile} text-white flex items-center justify-center text-sm group-open:rotate-180 transition-transform duration-300`}>
                          ▾
                        </span>
                      </summary>
                      <div className="px-6 pb-5 -mt-1 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="card-premium text-center py-12 px-6 mt-16 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-primary-500/15 to-blue-500/15 blur-3xl" />
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white shadow-lg shadow-primary-500/20 ring-1 ring-white/30 mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="relative text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Still got a question?</h3>
            <p className="relative text-gray-500 dark:text-gray-400 mb-6">
              Our Ramsgate team replies within 1 business hour.
            </p>
            <Link
              href="/contact"
              className="relative btn-premium inline-flex"
            >
              Contact us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
