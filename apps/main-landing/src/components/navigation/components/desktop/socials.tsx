import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NavigationMenu } from '@idriss-xyz/ui/navigation-menu';

const SOCIALS: { iconName: IconName; link: string }[] = [
  {
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    iconName: 'Farcaster',
    link: SOCIAL_LINK.WARPCAST,
  },
];

export const Socials = () => {
  return (
    <div className="flex items-center space-x-2">
      {SOCIALS.map((social, index) => {
        return (
          <NavigationMenu.Item key={index}>
            <NavigationMenu.Link asChild>
              <IconButton
                size="large"
                intent="tertiary"
                iconName={social.iconName}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                asLink
              />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        );
      })}
    </div>
  );
};
