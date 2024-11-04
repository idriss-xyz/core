import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconName } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';

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
            target="_blank"
            rel="noopener noreferrer"
            asLink
          />
        );
      })}
    </div>
  );
};
