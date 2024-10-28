import { SOCIAL_LINK } from '@idriss-xyz/constants';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  className?: string;
};

export const Socials = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'grid grid-cols-3 justify-between gap-y-3 [&>:nth-child(3n+1)]:justify-self-start [&>:nth-child(3n+2)]:justify-self-center [&>:nth-child(3n+3)]:justify-self-end',
        className,
      )}
    >
      <IconButton
        iconName="TwitterX"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.X}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />
      <IconButton
        iconName="Farcaster"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.WARPCAST}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />

      <IconButton
        iconName="Discord"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.DISCORD}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />

      <IconButton
        iconName="Instagram"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.INSTAGRAM}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />
      <IconButton
        iconName="Tiktok"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.TIKTOK}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />
      <IconButton
        iconName="Youtube"
        intent="tertiary"
        size="large"
        href={SOCIAL_LINK.YOUTUBE}
        rel="noopener noreferrer"
        target="_blank"
        asLink
      />
    </div>
  );
};
