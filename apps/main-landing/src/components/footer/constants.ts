import {
  BLOG_LINK,
  BRAND_GUIDELINE_LINK,
  DOCUMENTATION_LINK,
  GITHUB_LINK,
  SOCIAL_LINK,
} from '@idriss-xyz/constants';

import { INTERNAL_LINK } from '@/constants';

import { SectionItem } from './types';

export const INTERNAL_LINKS: SectionItem[] = [
  {
    link: INTERNAL_LINK.EXTENSION,
    name: 'EXTENSION',
    isExternal: false,
  },
  {
    link: INTERNAL_LINK.CREATORS,
    name: 'CREATORS',
    isExternal: false,
  },
  {
    link: INTERNAL_LINK.PREDICTION_MARKETS,
    name: 'PREDICTION MARKETS',
    isExternal: false,
  },
];

export const EXTERNAL_RESOURCES: SectionItem[] = [
  {
    link: DOCUMENTATION_LINK,
    name: 'DOCS',
    isExternal: true,
  },
  {
    link: GITHUB_LINK,
    name: 'GITHUB',
    isExternal: true,
  },
  {
    link: BLOG_LINK,
    name: 'BLOG',
    isExternal: true,
  },
  {
    link: BRAND_GUIDELINE_LINK,
    name: 'BRAND KIT',
    isExternal: true,
  },
];

export const SOCIALS: SectionItem[] = [
  {
    link: SOCIAL_LINK.X,
    name: 'X (TWITTER)',
    isExternal: true,
    prefixIconName: 'TwitterX',
  },
  {
    link: SOCIAL_LINK.WARPCAST,
    name: 'FARCASTER',
    isExternal: true,
    prefixIconName: 'Farcaster',
  },
  {
    link: SOCIAL_LINK.DISCORD,
    name: 'DISCORD',
    isExternal: true,
    prefixIconName: 'Discord',
  },
  {
    link: SOCIAL_LINK.INSTAGRAM,
    name: 'INSTAGRAM',
    isExternal: true,
    prefixIconName: 'Instagram',
  },
  {
    link: SOCIAL_LINK.TIKTOK,
    name: 'TIKTOK',
    isExternal: true,
    prefixIconName: 'Tiktok',
  },
  {
    link: SOCIAL_LINK.YOUTUBE,
    name: 'YOUTUBE',
    isExternal: true,
    prefixIconName: 'Youtube',
  },
];
