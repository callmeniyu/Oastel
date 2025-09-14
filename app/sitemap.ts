import { MetadataRoute } from 'next';
import { tourApi } from '@/lib/tourApi';
import { transferApi } from '@/lib/transferApi';
import { SITE_CONFIG } from '@/lib/seoUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transfers`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faqs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic tour routes
  let tourRoutes: MetadataRoute.Sitemap = [];
  try {
    const toursResponse = await tourApi.getTours({ limit: 1000 });
    if (toursResponse.success) {
      tourRoutes = toursResponse.data.map((tour: any) => ({
        url: `${baseUrl}/tours/${tour.slug}`,
        lastModified: tour.updatedAt ? new Date(tour.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error);
  }

  // Dynamic transfer routes
  let transferRoutes: MetadataRoute.Sitemap = [];
  try {
    const transfersResponse = await transferApi.getTransfers({ limit: 1000 });
    if (transfersResponse.success) {
      transferRoutes = transfersResponse.data.map((transfer: any) => ({
        url: `${baseUrl}/transfers/${transfer.slug}`,
        lastModified: transfer.updatedAt ? new Date(transfer.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error fetching transfers for sitemap:', error);
  }

  return [...staticRoutes, ...tourRoutes, ...transferRoutes];
}