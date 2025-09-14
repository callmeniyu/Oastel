import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/seoUtils';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/booking/payment-failed',
          '/booking/payment-success-booking-failed',
          '/auth',
          '/profile',
          '/cart',
          '/_next/',
          '/favicon/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/booking/payment-failed',
          '/booking/payment-success-booking-failed',
          '/auth',
          '/profile',
          '/cart',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}