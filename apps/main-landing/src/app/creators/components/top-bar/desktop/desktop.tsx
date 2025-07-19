import { Button } from '@idriss-xyz/ui/button';

import { useStartEarningNavigation } from '@/app/creators/utils/';

import { Socials } from './socials';
import { Menu } from './menu';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation, displayCTA }: Properties) => {
  const handleStartEarningClick = useStartEarningNavigation();

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
        <Socials className="hidden sm:flex" />
      )}
    </>
  );
};
