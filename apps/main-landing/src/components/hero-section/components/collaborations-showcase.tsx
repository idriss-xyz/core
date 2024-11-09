import {
  ANNOUNCEMENT_LINK,
  EXTERNAL_ANNOUNCEMENT_LINK,
} from '@idriss-xyz/constants';
import {
  AavegotchiLogo,
  AcrossLogo,
  AgoraFullLogo,
  GitcoinLogo,
  ParallelLogo,
  PolymarketLogo,
  SnapshotFullLogo,
  TallyLogo,
} from '@idriss-xyz/ui/branding-assets';
import { Button } from '@idriss-xyz/ui/button';
import { Marquee } from '@idriss-xyz/ui/marquee';
import { classes } from '@idriss-xyz/ui/utils';

type Properties = {
  className?: string;
};

const logoClassName =
  'h-5.5 w-auto text-neutralGreen-500 lg:h-10 hover:text-neutralGreen-700';

const collaborationLinks = [
  {
    label: 'Go to tweet about Parallel collaboration',
    logo: <ParallelLogo className={logoClassName} />,
    link: ANNOUNCEMENT_LINK.PARALLEL,
  },
  {
    label: 'Go to tweet about Across collaboration',
    logo: <AcrossLogo className={logoClassName} />,
    link: EXTERNAL_ANNOUNCEMENT_LINK.ACROSS,
  },
  {
    label: 'Go to tweet about Polymarket collaboration',
    logo: <PolymarketLogo className={logoClassName} />,
    link: EXTERNAL_ANNOUNCEMENT_LINK.POLYMARKET,
  },
  {
    label: 'Go to tweet about Gitcoin collaboration',
    logo: <GitcoinLogo className={logoClassName} />,
    link: EXTERNAL_ANNOUNCEMENT_LINK.GITCOIN,
  },
  {
    label: 'Go to tweet about Aavegotchi collaboration',
    logo: (
      <AavegotchiLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: ANNOUNCEMENT_LINK.AAVEGOTCHI,
  },
  {
    label: 'Go to tweet about Tally collaboration',
    logo: <TallyLogo className={logoClassName} />,
    link: ANNOUNCEMENT_LINK.TALLY,
  },
  {
    label: 'Go to tweet about Agora collaboration',
    logo: (
      <AgoraFullLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: EXTERNAL_ANNOUNCEMENT_LINK.AGORA,
  },
  {
    label: 'Go to tweet about Snapshot collaboration',
    logo: (
      <SnapshotFullLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: ANNOUNCEMENT_LINK.SNAPSHOT,
  },
];

export const CollaborationsShowcase = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'z-1 flex flex-col items-center justify-center gap-4 lg:gap-8',
        className,
      )}
    >
      <span className="text-button2 text-neutralGreen-500 lg:text-button1">
        WORKED WITH TOP CRYPTO PROJECTS
      </span>
      <Marquee
        className="container"
        items={collaborationLinks.map((collaborationLink) => {
          return (
            <Button
              className="rounded-none p-0"
              key={collaborationLink.link}
              intent="tertiary"
              size="large"
              href={collaborationLink.link}
              tabIndex={-1}
              aria-label={collaborationLink.label}
              isExternal
              asLink
            >
              {collaborationLink.logo}
            </Button>
          );
        })}
      />
    </div>
  );
};
