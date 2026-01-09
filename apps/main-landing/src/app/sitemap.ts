import { MetadataRoute } from 'next';

import { getAllCompareSlugs } from './compare/content';
import { getAllGuideSlugs } from './guides/content';

// ts-unused-exports:disable-next-line
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://idriss.xyz';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fan/ranking`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vault`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dao`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Compare/answer pages for SEO
  const compareSlugs = getAllCompareSlugs();
  const comparePages: MetadataRoute.Sitemap = compareSlugs.map((slug) => {
    return {
      url: `${baseUrl}/compare/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Guide pages for SEO
  const guideSlugs = getAllGuideSlugs();
  const guidePagesList: MetadataRoute.Sitemap = guideSlugs.map((slug) => {
    return {
      url: `${baseUrl}/guides/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...comparePages, ...guidePagesList];
}
