export const siteConfig = {
  name: 'AIRI Foundation',
  description:
    'Because AI impacts everyone, everyone deserves to understand and use it better.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://airifoundation.org',
  ogImage: '/og-image.png',
  links: {
    linkedin: 'https://linkedin.com/company/airi-foundation',
    instagram: 'https://instagram.com/airifoundation',
    facebook: 'https://facebook.com/airifoundation',
    donate: 'https://www.zeffy.com/en-CA/donation-form/airi-foundation',
  },
  emails: {
    enquiry: 'enquiry@airifoundation.org',
    contact: 'contact@airifoundation.org',
    career: 'career@airifoundation.org',
  },
  address: {
    street: 'Arnold Building, 519 7 St S - 104',
    city: 'Lethbridge',
    province: 'AB',
    postalCode: 'T1J 2G8',
    country: 'Canada',
  },
};

export type SiteConfig = typeof siteConfig;
