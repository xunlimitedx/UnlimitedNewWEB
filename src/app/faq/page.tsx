import type { Metadata } from 'next';
import Link from 'next/link';

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
  return (
    <div>
      <FaqJsonLd />
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our products, services, shipping, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.items.map((faq) => (
                  <details
                    key={faq.q}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-gray-900 hover:text-primary-600 transition-colors">
                      {faq.q}
                      <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
