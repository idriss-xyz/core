export const TEST_DONATION_MESSAGE = 'This is a test donation.';

import { IconName } from '@idriss-xyz/ui/icon';
import { SOCIAL_LINK } from '@idriss-xyz/constants';

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
