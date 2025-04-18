import { Desktop } from './desktop';
import { Mobile } from './mobile';

type Properties = {
  isSticky?: boolean;
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
  displayMobileCTA?: boolean;
};

export const Navigation = ({
  isSticky,
  isLanding,
  displayCTA,
  hideNavigation,
  displayMobileCTA,
}: Properties) => {
  return (
    <>
      <Mobile
        isSticky={isSticky}
        isLanding={isLanding}
        displayCTA={displayMobileCTA}
        hideNavigation={hideNavigation}
      />
      <Desktop hideNavigation={hideNavigation} displayCTA={displayCTA} />
    </>
  );
};
