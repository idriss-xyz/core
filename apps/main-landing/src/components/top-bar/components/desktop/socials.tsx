import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';

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
];

type Properties = {
  className?: string;
};

export const Socials = ({ className }: Properties) => {
  return (
    <div className={classes('flex items-center space-x-2', className)}>
      {SOCIALS.map((social, index) => {
        return (
          <IconButton
            key={index}
            size="large"
            intent="tertiary"
            iconName={social.iconName}
            href={social.link}
            aria-label={social.label}
            isExternal
            asLink
          />
        );
      })}
    </div>
  );
};
