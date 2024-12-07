import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  className?: string;
};

const SOCIALS: { label: string; iconName: IconName; link: string }[] = [
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
    label: 'Go to Tiktok',
    iconName: 'Tiktok',
    link: SOCIAL_LINK.TIKTOK,
  },
  {
    label: 'Go to Youtube',
    iconName: 'Youtube',
    link: SOCIAL_LINK.YOUTUBE,
  },
];

export const Socials = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'grid grid-cols-3 justify-between gap-y-3 [&>:nth-child(3n+1)]:justify-self-start [&>:nth-child(3n+2)]:justify-self-center [&>:nth-child(3n+3)]:justify-self-end',
        className,
      )}
    >
      {SOCIALS.map((social, index) => {
        return (
          <NavigationMenu.Item key={index}>
            <NavigationMenu.Link asChild>
              <IconButton
                iconName={social.iconName}
                intent="tertiary"
                size="large"
                href={social.link}
                isExternal
                asLink
              />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        );
      })}
    </div>
  );
};
