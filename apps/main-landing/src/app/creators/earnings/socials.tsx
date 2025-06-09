import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';

const SOCIALS: { label: string; iconName: IconName; link: string }[] = [
  {
    label: 'Go to Discord',
    iconName: 'Discord',
    link: SOCIAL_LINK.DISCORD,
  },
  {
    label: 'Go to Twitter',
    iconName: 'TwitterX',
    link: SOCIAL_LINK.X,
  },
  {
    label: 'Go to Farcaster',
    iconName: 'Farcaster',
    link: SOCIAL_LINK.FARCASTER,
  },
];

type Properties = {
  className?: string;
};

export const Socials = ({ className }: Properties) => {
  return (
    <div className={classes('flex items-center space-x-0.5', className)}>
      {SOCIALS.map((social, index) => {
        return (
          <IconButton
            asLink
            isExternal
            key={index}
            size="medium"
            intent="tertiary"
            href={social.link}
            aria-label={social.label}
            iconName={social.iconName}
          />
        );
      })}
    </div>
  );
};
