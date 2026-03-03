import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about ordering, shipping, returns, and IT services at Unlimited IT Solutions.',
  openGraph: {
    title: 'FAQ | Unlimited IT Solutions',
    description: 'Find answers to common questions about our products and services.',
  },
};

const faqs = [
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
        a: 'We accept credit cards, debit cards, and EFT payments. All transactions are processed through secure, PCI-compliant payment gateways.',
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
    category: 'Services & Support',
    items: [
      {
        q: 'Do you offer on-site IT support?',
        a: 'Yes, we provide on-site IT support in the KwaZulu-Natal South Coast area. Remote support is available nationwide.',
      },
      {
        q: 'Can you build a custom PC for me?',
        a: "Absolutely! Tell us your requirements and budget, and we'll design and build a system tailored to your needs. Contact us for a free quote.",
      },
      {
        q: 'Do you service businesses?',
        a: 'Yes, we offer SLA-based IT support contracts, network infrastructure, server management, and cloud solutions for businesses of all sizes.',
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
      {
        q: 'I forgot my password. What do I do?',
        a: 'Click "Forgot password?" on the login page. We\'ll send a password reset link to your registered email address.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div>
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
