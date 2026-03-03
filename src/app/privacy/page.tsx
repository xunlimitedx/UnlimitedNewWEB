import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Unlimited IT Solutions – how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">
          <strong>Effective Date:</strong> {new Date().getFullYear()}
        </p>

        <p className="text-gray-600">
          Unlimited IT Solutions (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal
          information in accordance with the Protection of Personal Information Act (POPIA) of
          South Africa.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Information We Collect</h2>
        <p className="text-gray-600">We collect the following types of information:</p>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>Personal details (name, email address, phone number) when you create an account or place an order</li>
          <li>Delivery address for shipping purposes</li>
          <li>Payment information (processed securely through our payment provider)</li>
          <li>Browsing behaviour and device information through cookies</li>
          <li>Communication history when you contact our support team</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>To process and fulfil your orders</li>
          <li>To communicate with you about your orders and account</li>
          <li>To provide customer support</li>
          <li>To improve our website and services</li>
          <li>To send marketing communications (only with your consent)</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Data Security</h2>
        <p className="text-gray-600">
          We implement appropriate technical and organisational measures to protect your personal
          information against unauthorised access, alteration, disclosure, or destruction. Your data
          is stored securely using industry-standard encryption.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Third-Party Sharing</h2>
        <p className="text-gray-600">
          We do not sell your personal information. We may share your data with trusted third parties
          only for the purpose of fulfilling orders (e.g., courier services, payment processors).
          These parties are contractually obligated to protect your data.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Cookies</h2>
        <p className="text-gray-600">
          Our website uses cookies to enhance your browsing experience. Cookies are small text files
          stored on your device. You can manage cookie preferences through your browser settings.
          See our <a href="/cookies" className="text-primary-600 hover:text-primary-700">Cookie Policy</a> for more details.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Your Rights Under POPIA</h2>
        <p className="text-gray-600">You have the right to:</p>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to the processing of your personal information</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Lodge a complaint with the Information Regulator</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">7. Data Retention</h2>
        <p className="text-gray-600">
          We retain your personal information only for as long as necessary to fulfil the purposes
          for which it was collected, or as required by law. Order records are retained for a minimum
          of 5 years for tax and legal purposes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">8. Contact</h2>
        <p className="text-gray-600">
          For privacy-related enquiries or to exercise your rights, contact us at:<br />
          Email: info@unlimitedits.co.za<br />
          Phone: 039 314 4359<br />
          Address: 202 Marine Drive, Ramsgate, 4285
        </p>
      </div>
    </div>
  );
}
