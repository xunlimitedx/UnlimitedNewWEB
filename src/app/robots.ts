import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/account/',
          '/checkout',
          '/checkout/',
          '/cart',
          '/wishlist',
          '/track/',
          '/search',
        ],
      },
    ],
    sitemap: 'https://unlimitedits.co.za/sitemap.xml',
  };
}
