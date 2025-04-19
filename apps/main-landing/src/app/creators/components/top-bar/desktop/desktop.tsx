import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_FORM_LINK } from '@idriss-xyz/constants';

import { Menu } from './menu';
import { Socials } from './socials';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation, displayCTA }: Properties) => {
  return (
    <>
      {!hideNavigation && <Menu className="hidden sm:flex" />}

      {displayCTA ? (
        <div className="hidden items-center gap-x-9 sm:flex">
          <Socials />

          <Button
            asLink
            size="medium"
            intent="primary"
            href={CREATORS_FORM_LINK}
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
