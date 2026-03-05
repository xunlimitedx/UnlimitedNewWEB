export default function JsonLd() {
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': ['ComputerStore', 'LocalBusiness'],
    '@id': 'https://unlimitedits.co.za/#business',
    name: 'Unlimited IT Solutions',
    alternateName: 'Unlimited4all T/A Unlimited IT Solutions',
    description:
      'Premier IT service provider in Ramsgate, KwaZulu-Natal. Computer repairs, laptop & Mac repairs, CCTV installations, networking, console repairs, server management, fine soldering, managed IT services, and hardware sales for individuals and businesses.',
    url: 'https://unlimitedits.co.za',
    logo: 'https://unlimitedits.co.za/images/logo.svg',
    image: 'https://unlimitedits.co.za/images/og-image.png',
    telephone: ['039 314 4359', '082 556 9875'],
    email: 'info@unlimitedits.co.za',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '202 Marine Drive',
      addressLocality: 'Ramsgate',
      addressRegion: 'KwaZulu-Natal',
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
    paymentAccepted: 'Credit Card, Debit Card, EFT, Cash',
    areaServed: [
      { '@type': 'City', name: 'Ramsgate' },
      { '@type': 'State', name: 'KwaZulu-Natal' },
      { '@type': 'Country', name: 'South Africa' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT Services & Products',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Repair Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Computer Repair', description: 'Hardware and software repair for desktops and laptops including Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mac Repair', description: 'Apple MacBook, iMac, Mac Mini, and Mac Pro repair and troubleshooting' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Console Repair', description: 'PlayStation, Xbox, and Nintendo gaming console repairs' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fine Soldering & Part Replacement', description: 'Precision soldering for delicate components and replacement of defective parts' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Server Repair & Maintenance', description: 'Server setup, installation, maintenance, troubleshooting, and upgrades' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Repair', description: 'Software troubleshooting, Windows repairs, virus removal, and system optimization' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Installation Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CCTV Installation & Maintenance', description: 'CCTV system setup, installation, maintenance, remote monitoring, and integration with security systems' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Network Installation & Maintenance', description: 'Network infrastructure setup, Wi-Fi, cabling, VPN, and secure network solutions' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Internet Solutions', description: 'High-speed internet setup, Wi-Fi design, and internet troubleshooting' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'IT Support & Management',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Managed IT Services', description: 'Proactive monitoring, IT infrastructure management, helpdesk support' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Support & Maintenance', description: 'Regular system maintenance, troubleshooting, virus protection, security patches' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Remote Support', description: 'Remote troubleshooting, maintenance, and secure remote access setup' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'On-site Callouts', description: 'On-site troubleshooting, repairs, installations, and setups at your location' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Scheduled Maintenance', description: 'Daily, weekly, or bi-weekly maintenance schedules, system check-ups, and preventative maintenance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cloud Services', description: 'Cloud migration, storage, backup, disaster recovery, and SaaS solutions' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Consulting & Strategy', description: 'IT strategy, technology planning, cybersecurity audits, and compliance' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Hardware & Software Sales',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Computers & Laptops', description: 'New and refurbished computers from Dell, HP, Lenovo, ASUS, Acer, MSI, Toshiba, and Apple' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Gaming Consoles', description: 'New and refurbished PlayStation, Xbox, and Nintendo consoles' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Adobe Software', description: 'Certified reseller: Acrobat, Photoshop, Illustrator, Premiere Pro, Creative Cloud' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Microsoft Products', description: 'Windows 10, Windows 11, Office Suite, Microsoft 365' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Antivirus Software', description: 'Norton, McAfee, Kaspersky, Bitdefender, Avast' } },
          ],
        },
      ],
    },
    brand: [
      { '@type': 'Brand', name: 'Dell' },
      { '@type': 'Brand', name: 'HP' },
      { '@type': 'Brand', name: 'Lenovo' },
      { '@type': 'Brand', name: 'ASUS' },
      { '@type': 'Brand', name: 'Acer' },
      { '@type': 'Brand', name: 'MSI' },
      { '@type': 'Brand', name: 'Apple' },
      { '@type': 'Brand', name: 'Microsoft' },
      { '@type': 'Brand', name: 'Adobe' },
    ],
    knowsAbout: [
      'Computer Repair', 'Laptop Repair', 'Mac Repair', 'Console Repair',
      'CCTV Installation', 'Network Installation', 'Server Management',
      'IT Support', 'Remote Support', 'Cloud Services', 'Cybersecurity',
      'Fine Soldering', 'Custom PC Builds', 'Software Installation',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
    />
  );
}
