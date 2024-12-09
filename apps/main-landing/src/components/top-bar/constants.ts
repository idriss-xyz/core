import { INTERNAL_LINK } from '@/constants';

import { NavigationSectionItem } from './types';

export const APPS_SECTION_NAVIGATION_ITEMS: NavigationSectionItem[] = [
  {
    title: 'EXTENSION',
    description: 'Crypto and AI expansion pack for your browser',
    url: `/${INTERNAL_LINK.EXTENSION}`,
  },
  {
    title: 'CREATORS',
    description: 'Monetize your content on Twitch, YouTube, and more',
    url: `/${INTERNAL_LINK.CREATORS}`,
  },
  {
    title: 'PREDICTION MARKETS',
    description: 'Decentralized community notes for the internet',
    url: `/${INTERNAL_LINK.PREDICTION_MARKETS}`,
  },
];
