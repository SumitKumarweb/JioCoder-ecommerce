import { getSiteUrl } from '@/lib/seo/getSiteUrl';

export default function OrganizationSchema() {
  const baseUrl = getSiteUrl();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'OnlineStore'],
        '@id': `${baseUrl}/#organization`,
        name: 'JioCoder',
        alternateName: ['JioCoder India', 'jiocoder.com'],
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: `${baseUrl}/logo.png`,
          contentUrl: `${baseUrl}/logo.png`,
          caption: 'JioCoder',
        },
        image: { '@id': `${baseUrl}/#logo` },
        description:
          'JioCoder is an India-focused online store for mechanical keyboards, gaming mice, keycaps, custom cables, and desk accessories—plus JioCoder Studio for custom-printed desk mats and large mouse pads. The site also offers free /code learning paths (JavaScript, Python, Java, C, C++, C#, web) with an interactive playground.',
        slogan: 'Premium mechanical keyboards & gaming peripherals, shipped across India.',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
            url: `${baseUrl}/support`,
          },
        ],
        sameAs: [
          // Add verified social profiles when live (improves Knowledge Graph):
          // 'https://www.instagram.com/jiocoder',
          // 'https://x.com/jiocoder',
        ],
        foundingDate: '2024',
        numberOfEmployees: {
          '@type': 'QuantitativeValue',
          minValue: 1,
          maxValue: 50,
        },
        knowsAbout: [
          'Mechanical keyboards',
          'Gaming keyboards India',
          'Hot-swappable keyboards',
          'Gaming mice',
          'Keycaps PBT ABS',
          'Custom coiled cables',
          'Desk mats',
          'Extended mouse pads',
          'Custom printed mouse pad',
          'Gaming peripherals',
          'PC gaming accessories',
          'JioCoder Studio custom desk mat',
          'Learn to code',
          'JavaScript tutorial',
          'Python programming',
          'Java programming',
          'C programming',
          'C++ programming',
          'C# programming',
          'HTML CSS web development',
          'Online code playground',
        ],
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking, Wallets',
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'JioCoder',
        description:
          'Shop mechanical keyboards, gaming mice, keycaps, cables, and custom desk mats. Use JioCoder Studio to design your own mouse pad. Learn programming free at /code with live editors and runners.',
        publisher: { '@id': `${baseUrl}/#organization` },
        about: { '@id': `${baseUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-IN', 'en'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
