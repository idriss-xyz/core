import { IconName } from '@idriss-xyz/ui/icon';
import { SOCIAL_LINK } from '@idriss-xyz/constants';

export const socialOptions: {
  label: string;
  iconName: IconName;
  link: string;
}[] = [
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
