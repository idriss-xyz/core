import { Button } from '@idriss-xyz/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { CREATORS_LINK } from '@idriss-xyz/constants';

import { useStartEarningNavigation } from '@/app/creators/utils/';
import { DonatePageAvatarMenu } from '@/app/creators/[name]/donate-page-avatar-menu';

import { Socials } from './socials';
import { Menu } from './menu';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation, displayCTA }: Properties) => {
  const handleStartEarningClick = useStartEarningNavigation();
  const { user } = usePrivy();

  return (
    <>
      {!hideNavigation && <Menu className="hidden sm:flex" />}

      {displayCTA ? (
        <div className="hidden items-center gap-x-9 sm:flex">
          <Socials />

          <Button
            size="medium"
            intent="primary"
            onClick={handleStartEarningClick}
            aria-label="Start earning"
            suffixIconName="IdrissArrowRight"
          >
            Start earning
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          <Button
            asLink
            isExternal
            size="small"
            intent="secondary"
            href={CREATORS_LINK}
            className="lg:px-5 lg:py-3.5 uppercase"
          >
            Create your page
          </Button>
          {user ? <DonatePageAvatarMenu /> : <Socials className="hidden sm:flex" />}
        </div>
      )}
    </>
  );
};
