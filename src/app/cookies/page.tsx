import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for Unlimited IT Solutions – how we use cookies on our website.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-gray-600">
          <strong>Effective Date:</strong> {new Date().getFullYear()}
        </p>

        <p className="text-gray-600">
          This Cookie Policy explains how Unlimited IT Solutions uses cookies and similar technologies
          on our website unlimitedits.co.za.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">1. What Are Cookies?</h2>
        <p className="text-gray-600">
          Cookies are small text files that are placed on your device when you visit a website. They
          are widely used to make websites work more efficiently and to provide information to the
          website owners.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Cookies We Use</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">Essential Cookies</h3>
        <p className="text-gray-600">
          These cookies are necessary for the website to function properly. They enable core
          functionality such as authentication, shopping cart management, and security. You cannot
          opt out of essential cookies.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">Functional Cookies</h3>
        <p className="text-gray-600">
          These cookies enable enhanced functionality and personalisation, such as remembering your
          preferences and settings. If you do not allow these cookies, some features may not function
          properly.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-4">Analytics Cookies</h3>
        <p className="text-gray-600">
          These cookies help us understand how visitors interact with our website by collecting and
          reporting information anonymously. This helps us improve our site and your experience.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Managing Cookies</h2>
        <p className="text-gray-600">
          You can control and manage cookies through your browser settings. Most browsers allow you
          to refuse or delete cookies. However, if you block essential cookies, parts of our website
          may not function correctly.
        </p>
        <p className="text-gray-600">
          To manage cookies in common browsers:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-1">
          <li>Chrome: Settings → Privacy and security → Cookies</li>
          <li>Firefox: Settings → Privacy &amp; Security → Cookies</li>
          <li>Safari: Preferences → Privacy → Cookies</li>
          <li>Edge: Settings → Cookies and site permissions</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Third-Party Cookies</h2>
        <p className="text-gray-600">
          Some cookies on our website are placed by third-party services, including Google Firebase
          (for authentication) and payment processors. These services have their own cookie policies.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Updates to This Policy</h2>
        <p className="text-gray-600">
          We may update this Cookie Policy from time to time to reflect changes in technology or
          legislation. The updated version will be posted on this page with a revised effective date.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Contact</h2>
        <p className="text-gray-600">
          If you have any questions about our use of cookies, please contact us at:<br />
          Email: info@unlimitedits.co.za<br />
          Phone: 039 314 4359<br />
          Address: 202 Marine Drive, Ramsgate, 4285
        </p>
      </div>
    </div>
  );
}
