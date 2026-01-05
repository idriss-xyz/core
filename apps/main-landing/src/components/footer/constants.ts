import {
  BRAND_GUIDELINE_LINK,
  DAO_LINK,
  DOCUMENTATION_LINK,
  GITHUB_LINK,
  SNAPSHOT_IDRISS_LINK,
  SOCIAL_LINK,
} from '@idriss-xyz/constants';

import { SectionItem } from './types';

export const EXTERNAL_RESOURCES_DAO: SectionItem[] = [
  {
    link: DOCUMENTATION_LINK,
    name: 'DOCS',
    isExternal: true,
  },
  {
    link: SNAPSHOT_IDRISS_LINK,
    name: 'SNAPSHOT',
    isExternal: true,
  },
  {
    link: GITHUB_LINK,
    name: 'GITHUB',
    isExternal: true,
  },
  {
    link: BRAND_GUIDELINE_LINK,
    name: 'BRAND',
    isExternal: true,
  },
];

export const EXTERNAL_RESOURCES_LANDING: SectionItem[] = [
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
    link: DAO_LINK,
    name: 'DAO',
    isExternal: true,
  },
  {
    link: BRAND_GUIDELINE_LINK,
    name: 'BRAND',
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
