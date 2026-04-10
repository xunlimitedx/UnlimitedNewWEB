import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Unlimited IT Solutions online store.',
  alternates: {
    canonical: 'https://unlimitedits.co.za/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">
          <strong>Effective Date:</strong> {new Date().getFullYear()}
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Introduction</h2>
        <p className="text-gray-600">
          Welcome to Unlimited IT Solutions (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing and using our
          website at unlimitedits.co.za, you agree to be bound by these Terms of Service. If you do
          not agree with any part of these terms, please do not use our website.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Products &amp; Services</h2>
        <p className="text-gray-600">
          We sell IT products including but not limited to laptops, desktops, computer components,
          peripherals, networking equipment, and software. We also provide IT services including
          repairs, support, and consulting. All products are subject to availability.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Pricing &amp; Payment</h2>
        <p className="text-gray-600">
          All prices are listed in South African Rand (ZAR) and include VAT at 15% unless otherwise
          stated. We reserve the right to change prices at any time without prior notice. Payment
          must be made in full before goods are dispatched.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Shipping &amp; Delivery</h2>
        <p className="text-gray-600">
          We offer delivery throughout South Africa. Delivery times vary depending on your location.
          Orders over R2,500 qualify for free standard shipping. We are not responsible for delays
          caused by courier services or circumstances beyond our control.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Returns &amp; Refunds</h2>
        <p className="text-gray-600">
          In accordance with the Consumer Protection Act (CPA) of South Africa, you may return
          goods within 7 days of delivery for a full refund, provided the goods are in original
          condition and packaging. Defective products are covered under manufacturer warranty.
          Please contact support@unlimitedits.co.za to initiate a return.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">6. User Accounts</h2>
        <p className="text-gray-600">
          You are responsible for maintaining the confidentiality of your account credentials and for
          all activities that occur under your account. You must provide accurate and complete
          information when creating an account.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">7. Intellectual Property</h2>
        <p className="text-gray-600">
          All content on this website, including text, graphics, logos, images, and software, is the
          property of Unlimited IT Solutions and is protected by South African intellectual property
          laws. You may not reproduce, distribute, or modify any content without our written consent.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">8. Limitation of Liability</h2>
        <p className="text-gray-600">
          To the maximum extent permitted by law, Unlimited IT Solutions shall not be liable for any
          indirect, incidental, special, or consequential damages arising from the use of our website
          or products.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">9. Governing Law</h2>
        <p className="text-gray-600">
          These terms shall be governed by and construed in accordance with the laws of the Republic
          of South Africa. Any disputes shall be subject to the jurisdiction of the South African courts.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">10. Contact</h2>
        <p className="text-gray-600">
          For questions about these Terms of Service, please contact us at:<br />
          Email: info@unlimitedits.co.za<br />
          Phone: 039 314 4359<br />
          Address: 202 Marine Drive, Ramsgate, 4285
        </p>
      </div>
    </div>
  );
}
