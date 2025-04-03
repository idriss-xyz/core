import { Button } from '@idriss-xyz/ui/button';

import { INTERNAL_LINK } from '@/constants';

import { Menu } from './menu';
import { Socials } from './socials';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation, displayCTA }: Properties) => {
  return (
    <>
      {!hideNavigation && <Menu className="hidden md:flex" />}

      {displayCTA ? (
        <div className="hidden items-center gap-x-9 md:flex">
          <Socials />

          <Button
            asLink
            size="medium"
            intent="primary"
            aria-label="Start earning"
            href={INTERNAL_LINK.SUPERPOWERS}
            suffixIconName="IdrissArrowRight"
          >
            START EARNING
          </Button>
        </div>
      ) : (
        <Socials className="hidden md:flex" />
      )}
    </>
  );
};
