import { Metadata } from 'next';
import { resolveImageUrl } from '@/lib/imageUtils';

// Define SEO keywords by category
export const SEO_KEYWORDS = {
  // Primary destination keywords
  destinations: [
    'Cameron Highlands',
    'Taman Negara', 
    'Kuala Besut',
    'Perhentian Islands',
    'Kuala Lumpur',
    'Malaysia'
  ],
  
  // Tour-specific keywords
  tours: [
    'Mossy Forest tour',
    'Mossy Forest Cameron Highlands',
    'Cameron Highlands Mossy Forest',
    'Mossy Forest hiking',
    'Mossy Forest trekking',
    'Half day land rover tour Cameron Highlands',
    'Sunrise tour Cameron Highlands private',
    'Cameron Highlands tour packages Malaysia',
    'Pahang private tours',
    'Private tour Cameron Highlands',
    'Co-tour Cameron Highlands',
    'Budget tour',
    'Family tour',
    'Adventure tours Malaysia',
    'Half day tours Malaysia',
    'Sunrise tour Malaysia'
  ],
  
  // Transfer-specific keywords  
  transfers: [
    'Minivan transfer Cameron Highlands to Kuala Besut',
    'Taman Negara to Perhentian Islands transfer',
    'Kuala Tahan minivan transfer',
    'Cameron Highlands to Perhentian Islands transfer',
    'Perhentian Islands boat ticket + minivan',
    'Van transfer Malaysia',
    'Private van Malaysia',
    'Boat + van transfer Malaysia',
    'Van ticket Malaysia',
    'Taman Negara transfer van Malaysia',
    'Kuala Besut jetty van transfer',
    'Private tour from Kuala Lumpur to Cameron Highlands'
  ],
  
  // Service-related keywords
  services: [
    'Tours and transfers Malaysia',
    'Budget tours Malaysia',
    'Friendly tour',
    'Sharing trip',
    'Private trip',
    'Family trip',
    'Vacation',
    'Intimate group adventure tour Malaysia',
    'Pick up from hostel tour Cameron Highlands'
  ],
  
  // Price/booking related
  pricing: [
    'Mossy Forest entrance fee',
    'Mossy Forest ticket price', 
    'Mossy Forest Cameron Highlands fees',
    'Mossy Forest admission cost',
    'Book private van transfer Malaysia online',
    'Cheap private tour Malaysia Cameron Highlands',
    'Shared co-tour vs private tour cost Malaysia'
  ]
};

// Social media and contact information
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/oastelvibe?igsh=N3kxZGttN2ZqYXpv&utm_source=qr',
  whatsapp: 'http://wa.me/60196592141'
};

// Website constants
export const SITE_CONFIG = {
  name: 'Oastel',
  title: 'Oastel - Tours, Transfers & Stays in Cameron Highlands',
  description: 'Discover Cameron Highlands with Oastel\'s budget-friendly tours and transfers. From Cameron Highlands Mossy Forest tours to Perhentian Islands transfers, we offer private and shared adventures across Malaysia.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://oastel.com', // Update with actual domain
  author: 'Oastel Team',
  keywords: [
    ...SEO_KEYWORDS.destinations,
    ...SEO_KEYWORDS.tours.slice(0, 10), // First 10 tour keywords
    ...SEO_KEYWORDS.transfers.slice(0, 10), // First 10 transfer keywords
    ...SEO_KEYWORDS.services.slice(0, 5) // First 5 service keywords
  ]
};

// Helper function to strip HTML tags for meta descriptions
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to truncate text to specific length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Generate keywords array for specific content
export function generateKeywords(
  baseKeywords: string[] = [],
  contentType: 'tour' | 'transfer' | 'general' | 'blog' = 'general',
  location?: string
): string[] {
  let keywords = [...baseKeywords, ...SITE_CONFIG.keywords];
  
  // Add content-specific keywords
  if (contentType === 'tour') {
    keywords.push(...SEO_KEYWORDS.tours.slice(0, 15));
  } else if (contentType === 'transfer') {
    keywords.push(...SEO_KEYWORDS.transfers.slice(0, 15));
  }
  
  // Add location-specific keywords if provided
  if (location) {
    keywords.push(`${location} tour`, `${location} transfer`, `visit ${location}`);
  }
  
  // Remove duplicates and limit to 30 keywords max
  return [...new Set(keywords)].slice(0, 30);
}

// Generate structured data for tours
export function generateTourStructuredData(tour: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TourPackage',
    name: tour.title,
    description: stripHtmlTags(tour.description || tour.desc),
    image: tour.image,
    offers: {
      '@type': 'Offer',
      price: tour.newPrice,
      priceCurrency: 'MYR',
      availability: tour.status === 'active' ? 'InStock' : 'OutOfStock'
    },
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    },
    duration: `PT${tour.duration}H`,
    touristType: tour.type === 'private' ? 'Private' : 'Group'
  };
}

// Generate structured data for transfers
export function generateTransferStructuredData(transfer: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelService',
    name: transfer.title,
    description: stripHtmlTags(transfer.description || transfer.desc),
    image: transfer.image,
    offers: {
      '@type': 'Offer',
      price: transfer.newPrice,
      priceCurrency: 'MYR',
      availability: transfer.status === 'active' ? 'InStock' : 'OutOfStock'
    },
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url
    },
    serviceType: 'Transportation'
  };
}

// Generate Open Graph metadata
export function generateOpenGraph(
  title: string,
  description: string,
  image?: string,
  url?: string
) {
  return {
    title,
    description: truncateText(description, 160),
    url: url || SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: image || '/images/default-og-image.jpg', // Add a default OG image
        width: 1200,
        height: 630,
        alt: title
      }
    ],
    locale: 'en_US',
    type: 'website'
  };
}

// Generate Twitter Card metadata
export function generateTwitterCard(
  title: string,
  description: string,
  image?: string
) {
  return {
    card: 'summary_large_image',
    title: truncateText(title, 70),
    description: truncateText(description, 160),
    images: [image || '/images/default-og-image.jpg'],
    creator: '@oastelvibe'
  };
}

// Main function to generate complete metadata for tours
export function generateTourMetadata(tour: any): Metadata {
  // Extract destination from title or tags
  const destination = extractDestination(tour.title, tour.tags) || 'Malaysia';
  
  const title = `${tour.title} | ${tour.type === 'private' ? 'Private' : 'Shared'} Tour in ${destination} - Oastel`;
  const description = truncateText(
    stripHtmlTags(tour.description || tour.desc || `Explore ${destination} with our ${tour.type} tour. ${tour.title} - Book now for an unforgettable adventure.`),
    160
  );
  
  const keywords = generateKeywords(
    [tour.title, ...(tour.tags || [])],
    'tour',
    destination
  );

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_CONFIG.author }],
    openGraph: generateOpenGraph(title, description, tour.image),
    twitter: generateTwitterCard(title, description, tour.image),
    alternates: {
      canonical: `${SITE_CONFIG.url}/tours/${tour.slug}`
    },
    other: {
      'structured-data': JSON.stringify(generateTourStructuredData(tour))
    }
  };
}

// Helper function to extract destination from title and tags
function extractDestination(title: string, tags: string[] = []): string | null {
  const allText = [title, ...tags].join(' ').toLowerCase();
  
  const destinations = [
    'cameron highlands',
    'taman negara', 
    'kuala besut',
    'perhentian islands',
    'kuala lumpur',
    'pahang',
    'mossy forest'
  ];
  
  for (const dest of destinations) {
    if (allText.includes(dest)) {
      // Return properly capitalized destination
      return dest.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return null;
}

// Main function to generate complete metadata for transfers
export function generateTransferMetadata(transfer: any): Metadata {
  const title = `${transfer.title} | ${transfer.from} to ${transfer.to} Transfer - Oastel`;
  const description = truncateText(
    stripHtmlTags(transfer.description || transfer.desc || `Comfortable ${transfer.type} transfer from ${transfer.from} to ${transfer.to}. Book your Malaysia transfer with Oastel.`),
    160
  );
  
  const keywords = generateKeywords(
    [transfer.title, transfer.from, transfer.to, ...(transfer.tags || [])],
    'transfer',
    `${transfer.from} ${transfer.to}`
  );

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_CONFIG.author }],
    openGraph: generateOpenGraph(title, description, transfer.image),
    twitter: generateTwitterCard(title, description, transfer.image),
    alternates: {
      canonical: `${SITE_CONFIG.url}/transfers/${transfer.slug}`
    },
    other: {
      'structured-data': JSON.stringify(generateTransferStructuredData(transfer))
    }
  };
}

// Generate metadata for general pages
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  keywords: string[] = []
): Metadata {
  const fullTitle = `${title} - ${SITE_CONFIG.name}`;
  const metaKeywords = generateKeywords(keywords, 'general');
  
  return {
    title: fullTitle,
    description: truncateText(description, 160),
    keywords: metaKeywords.join(', '),
    authors: [{ name: SITE_CONFIG.author }],
    openGraph: generateOpenGraph(fullTitle, description),
    twitter: generateTwitterCard(fullTitle, description),
    alternates: {
      canonical: `${SITE_CONFIG.url}${path}`
    }
  };
}

// Main function to generate complete metadata for blogs
export function generateBlogMetadata(blog: any): Metadata {
  const title = `${blog.title} | ${blog.category} Blog - Oastel`;
  const description = truncateText(
    stripHtmlTags(blog.description || blog.content || `Read about ${blog.title} on Oastel's blog. Discover travel tips, destination guides, and more.`),
    160
  );
  
  const keywords = generateKeywords(
    [blog.title, blog.category, ...(blog.tags || [])],
    'blog',
    'Malaysia travel'
  );

  // Format publish date for structured data
  const publishDate = blog.publishDate || blog.createdAt;
  const isoDate = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_CONFIG.author }],
    openGraph: {
      ...generateOpenGraph(title, description, blog.image),
      type: 'article',
      publishedTime: isoDate,
      section: blog.category,
      tags: blog.tags || [blog.category]
    },
    twitter: generateTwitterCard(title, description, blog.image),
    alternates: {
      canonical: `${SITE_CONFIG.url}/blogs/${blog.slug}`
    },
    other: {
      'structured-data': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        description: description,
        image: blog.image ? resolveImageUrl(blog.image) : `${SITE_CONFIG.url}/images/og-default.jpg`,
        author: {
          '@type': 'Organization',
          name: SITE_CONFIG.author
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.author,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_CONFIG.url}/images/logo.png`
          }
        },
        datePublished: isoDate,
        dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : isoDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_CONFIG.url}/blogs/${blog.slug}`
        },
        articleSection: blog.category,
        wordCount: stripHtmlTags(blog.content || '').split(' ').length
      })
    }
  };
}