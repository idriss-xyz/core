import {
  classes,
  DiscordSocialIcon,
  FarcasterSocialIcon,
  IconButton,
  InstagramSocialIcon,
  TiktokSocialIcon,
  XSocialIcon,
  YoutubeSocialIcon,
} from '@idriss-xyz/ui';
import { SOCIAL_LINK } from '@idriss-xyz/constants';

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
        icon={<XSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.X, '_blank');
        }}
      />
      <IconButton
        icon={<FarcasterSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.WARPCAST, '_blank');
        }}
      />

      <IconButton
        icon={<DiscordSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.DISCORD, '_blank');
        }}
      />

      <IconButton
        icon={<InstagramSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.INSTAGRAM, '_blank');
        }}
      />
      <IconButton
        icon={<TiktokSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.TIKTOK, '_blank');
        }}
      />

      <IconButton
        icon={<YoutubeSocialIcon />}
        intent="tertiary"
        size="large"
        onClick={() => {
          // TODO: we need to create isomorphic button component so it will be as="a" href={...}
          window.open(SOCIAL_LINK.YOUTUBE, '_blank');
        }}
      />
    </div>
  );
};
