export default function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Unlimited IT Solutions',
    description:
      'Your one-stop shop for all things tech. From high-performance laptops to essential components. Unlimited IT Solutions provides reliable IT solutions for businesses and individuals across South Africa.',
    url: 'https://unlimitedits.co.za',
    logo: 'https://unlimitedits.co.za/images/logo.svg',
    telephone: ['039 314 4359', '082 556 9875'],
    email: 'info@unlimitedits.co.za',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '202 Marine Drive',
      addressLocality: 'Ramsgate',
      postalCode: '4285',
      addressCountry: 'ZA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -30.8883,
      longitude: 30.3538,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    sameAs: ['https://www.facebook.com/unlimitedits'],
    priceRange: '$$',
    currenciesAccepted: 'ZAR',
    paymentAccepted: 'Credit Card, Debit Card, EFT',
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
