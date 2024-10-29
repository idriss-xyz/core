import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  className?: string;
};

const SOCIALS: { iconName: IconName; link: string }[] = [
  {
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    iconName: 'Farcaster',
    link: SOCIAL_LINK.WARPCAST,
  },
  {
    iconName: 'Discord',
    link: SOCIAL_LINK.DISCORD,
  },
  {
    iconName: 'Instagram',
    link: SOCIAL_LINK.INSTAGRAM,
  },
  {
    iconName: 'Tiktok',
    link: SOCIAL_LINK.TIKTOK,
  },
  {
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
                rel="noopener noreferrer"
                target="_blank"
                asLink
              />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        );
      })}
    </div>
  );
};
