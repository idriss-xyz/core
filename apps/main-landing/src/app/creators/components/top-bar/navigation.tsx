import { Desktop } from './desktop';
import { Mobile } from './mobile';

type Properties = {
  isSticky?: boolean;
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Navigation = ({
  isSticky,
  isLanding,
  displayCTA,
  hideNavigation,
}: Properties) => {
  return (
    <>
      <Mobile
        isSticky={isSticky}
        isLanding={isLanding}
        displayCTA={displayCTA}
        hideNavigation={hideNavigation}
      />
      <Desktop hideNavigation={hideNavigation} displayCTA={displayCTA} />
    </>
  );
};
