import { MetadataRoute } from 'next';

const BASE_URL = 'https://unlimitedits.co.za';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
    '/services',
    '/faq',
    '/terms',
    '/privacy',
    '/cookies',
  ];

  return staticPages.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : 0.7,
  }));
}
