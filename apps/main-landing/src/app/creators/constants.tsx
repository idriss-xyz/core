export const TEST_DONATION_MESSAGE = 'This is a test donation.';

import { IconName } from '@idriss-xyz/ui/icon';
import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { SiteMapItem } from '@idriss-xyz/ui/breadcrumb';

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
    path: '/',
  },
  {
    name: 'Earnings',
    path: '/earnings',
    children: [
      {
        name: 'Stats & history',
        path: '/earnings/stats',
      },
      {
        name: 'Balance',
        path: '/earnings/balance',
      },
      {
        name: 'Top donors',
        path: '/earnings/top-donors',
      },
    ],
  },
  {
    name: 'Setup',
    path: '/setup',
    children: [
      {
        name: 'Stream alerts',
        path: '/setup/stream-alerts',
      },
      {
        name: 'Donation panel',
        path: '/setup/donation-panel',
      },
      {
        name: 'Payment methods',
        path: 'setup/payment-methods',
      },
    ],
  },
  {
    name: 'Profile',
    path: '/profile',
  },
];

export const testDonation = {
  type: 'test' as const,
  donor: 'idriss_xyz',
  amount: Math.floor(Math.random() * 99) + 1, // Random amount between $1-100
  message: TEST_DONATION_MESSAGE,
  sfxText: null,
  avatarUrl: null,
  txnHash: '0x22f0f25140b9fe35cc01722bb5b0366dcb68bb1bcaee3415ca9f48ce4e57d972',
  token: {
    amount: 1_000_000_000_000,
    details: {
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
  },
};
