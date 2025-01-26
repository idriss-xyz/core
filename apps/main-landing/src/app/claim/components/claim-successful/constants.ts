import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';

export const SOCIALS: { label: string; iconName: IconName; link: string }[] = [
  {
    label: 'Go to Twitter',
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    label: 'Go to Farcaster',
    iconName: 'Farcaster',
    link: SOCIAL_LINK.WARPCAST,
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
    label: 'Go to TikTok',
    iconName: 'Tiktok',
    link: SOCIAL_LINK.TIKTOK,
  },
  {
    label: 'Go to YouTube',
    iconName: 'Youtube',
    link: SOCIAL_LINK.YOUTUBE,
  },
];
