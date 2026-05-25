export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NonProfit',
    name: 'AIRI Foundation',
    url: 'https://airifoundation.org',
    logo: 'https://airifoundation.org/images/AIRI-FOUNDATION.png',
    description:
      'AIRI Foundation advances inclusive AI literacy and ethical AI engagement across Canada through education, research, consulting, and partnerships.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lethbridge',
      addressRegion: 'AB',
      addressCountry: 'CA',
    },
    sameAs: [
      'https://www.linkedin.com/company/airi-foundation/',
    ],
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'Canada',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
