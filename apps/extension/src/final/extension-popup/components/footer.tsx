import { IconName } from '@idriss-xyz/ui/icon';
import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';

const SOCIALS: { iconName: IconName; link: string }[] = [
  {
    iconName: 'Discord',
    link: SOCIAL_LINK.DISCORD,
  },
  {
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    iconName: 'Farcaster',
    link: SOCIAL_LINK.WARPCAST,
  },
];

type Properties = {
  className?: string;
};

export const Footer = ({ className }: Properties) => {
  return (
    <footer
      className={classes(
        'flex justify-between border-t border-t-neutral-300 bg-white p-3',
        className,
      )}
    >
      {SOCIALS.map((social, index) => {
        return (
          <IconButton
            className="w-full"
            iconName={social.iconName}
            intent="tertiary"
            size="small"
            key={index}
            href={social.link}
            isExternal
            asLink
          />
        );
      })}
    </footer>
  );
};
