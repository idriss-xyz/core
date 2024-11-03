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
    logo: <ParallelLogo className={logoClassName} />,
    link: 'https://x.com/IDriss_xyz/status/1729258820441170160',
  },
  {
    logo: <AcrossLogo className={logoClassName} />,
    link: 'https://x.com/AcrossProtocol/status/1782919859439092151',
  },
  {
    logo: <PolymarketLogo className={logoClassName} />,
    link: 'https://x.com/Polymarket/status/1778470611083313375',
  },
  {
    logo: <GitcoinLogo className={logoClassName} />,
    link: 'https://x.com/gitcoin/status/1786121984105144501',
  },
  {
    logo: (
      <AavegotchiLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: 'https://x.com/IDriss_xyz/status/1750851248121930167',
  },
  {
    logo: <TallyLogo className={logoClassName} />,
    link: 'https://x.com/IDriss_xyz/status/1807798872930202007',
  },
  {
    logo: (
      <AgoraFullLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: 'https://x.com/AgoraGovernance/status/1820834836770329005',
  },
  {
    logo: (
      <SnapshotFullLogo
        className={classes(logoClassName, 'h-[17px] lg:h-[32px]')}
      />
    ),
    link: 'https://x.com/IDriss_xyz/status/1761049574691819798',
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
              asLink
              target="_blank"
              href={collaborationLink.link}
              tabIndex={-1}
            >
              {collaborationLink.logo}
            </Button>
          );
        })}
      />
    </div>
  );
};
