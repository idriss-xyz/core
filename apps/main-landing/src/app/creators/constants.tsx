export const TEST_DONATION_MESSAGE = 'This is a test donation.';

import { IconName } from '@idriss-xyz/ui/icon';
import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { SiteMapItem } from '@idriss-xyz/ui/breadcrumb';

import {
  BILL,
  DEFAULT_CASH_REGISTER_SOUND,
  DEFAULT_COIN_SOUND,
  DEFAULT_TRUMPET_SOUND,
  LAURA,
  LIAM,
  AxieLogo,
  OffTheGridLogo,
  RoninLogo,
  ParallelLogo,
} from '@/assets';

type SocialOption = {
  label: string;
  iconName: IconName;
  link: string;
};

export const socialOptions: SocialOption[] = [
  {
    label: 'Go to Twitter',
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    label: 'Go to Discord',
    iconName: 'Discord',
    link: SOCIAL_LINK.DISCORD,
  },
  {
    label: 'Go to Instagram',
    iconName: 'Instagram',
    link: SOCIAL_LINK.INSTAGRAM,
  },
  {
    label: 'Go to Tiktok',
    iconName: 'Tiktok',
    link: SOCIAL_LINK.TIKTOK,
  },
];

export const siteMap: SiteMapItem[] = [
  {
    name: 'Home',
    path: '',
  },
  {
    name: 'Earnings',
    path: 'earnings',
    children: [
      { name: 'Stats & history', path: 'stats-and-history' },
      { name: 'Balance', path: 'balance' },
      { name: 'Top donors', path: 'top-donors' },
    ],
  },
  {
    name: 'Setup',
    path: 'setup',
    children: [
      { name: 'Payment methods', path: 'payment-methods' },
      { name: 'Stream alerts', path: 'stream-alerts' },
      { name: 'Donation panel', path: 'donation-panel' },
    ],
  },
  {
    name: 'Profile',
    path: 'profile',
  },
  {
    name: 'Ranking',
    path: 'ranking',
    children: [
      { name: 'Top creators', path: 'top-creators' },
      { name: 'Top donors', path: 'top-donors' },
    ],
  },
  {
    name: 'Rewards',
    path: 'rewards',
    children: [{ name: 'Invites', path: 'invites' }],
  },
];

export const soundMap: Record<string, string> = {
  DEFAULT_TRUMPET_SOUND,
  DEFAULT_COIN_SOUND,
  DEFAULT_CASH_REGISTER_SOUND,
};

export const voiceMap: Record<string, { name: string; audioFile: string }> = {
  pqHfZKP75CvOlQylNhV4: { name: 'Bill', audioFile: BILL },
  FGY2WhTYpPnrIDTdsKH5: { name: 'Laura', audioFile: LAURA },
  TX3LPaxmHKxFdv7VOQHJ: { name: 'Liam', audioFile: LIAM },
};

export const defaultAlertSounds = [
  { value: 'DEFAULT_TRUMPET_SOUND', label: 'Classic trumpet' },
  { value: 'DEFAULT_COIN_SOUND', label: 'Coin drop' },
  { value: 'DEFAULT_CASH_REGISTER_SOUND', label: 'Cash register' },
];

export const gameLogoMap: Record<string, string> = {
  'Axie Infinity': AxieLogo.src,
  'Off The Grid': OffTheGridLogo.src,
  'Ronin': RoninLogo.src,
  'Parallel': ParallelLogo.src,
};
