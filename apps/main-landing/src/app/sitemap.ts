import { MetadataRoute } from 'next';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { getAllCompareSlugs } from './compare/content';
import { getAllGuideSlugs } from './guides/content';

type LeaderboardEntry = {
  displayName: string;
};

type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

async function getCreatorNames(): Promise<string[]> {
  try {
    const response = await fetch(`${CREATOR_API_URL}/creator-leaderboard`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data: LeaderboardResponse = await response.json();
    return data.leaderboard
      .slice(0, 20)
      .map((entry) => {
        return entry.displayName;
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function getFanNames(): Promise<string[]> {
  try {
    const response = await fetch(`${CREATOR_API_URL}/donor-leaderboard`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const data: LeaderboardResponse = await response.json();
    return data.leaderboard
      .map((entry) => {
        return entry.displayName;
      })
      .filter((name) => {
        return Boolean(name) && name !== 'anon';
      })
      .slice(0, 10);
  } catch {
    return [];
  }
}

// ts-unused-exports:disable-next-line
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Dynamic creator pages from leaderboard
  const creatorNames = await getCreatorNames();
  const creatorPages: MetadataRoute.Sitemap = creatorNames.map((name) => {
    return {
      url: `${baseUrl}/${name.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // Dynamic fan pages from donor leaderboard
  const fanNames = await getFanNames();
  const fanPages: MetadataRoute.Sitemap = fanNames.map((name) => {
    return {
      url: `${baseUrl}/fan/${name.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  });

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

  return [
    ...staticPages,
    ...creatorPages,
    ...fanPages,
    ...comparePages,
    ...guidePagesList,
  ];
}
