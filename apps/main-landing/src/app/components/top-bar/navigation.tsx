import { Desktop } from './desktop';

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
    <Desktop
      hideNavigation={hideNavigation}
      displayCTA={displayCTA}
      isSticky={isSticky}
      isLanding={isLanding}
      displayMobileCTA={displayMobileCTA}
    />
  );
};
