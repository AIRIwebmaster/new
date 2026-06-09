import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://airifoundation.org';

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/programs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/programs/professionals`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/programs/code-ai-club`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/programs/new-canadians`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/programs/seniors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/solutions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/solutions/business`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/solutions/community`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/volunteer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/career`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/donate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/register-codeaiclub`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];
}
