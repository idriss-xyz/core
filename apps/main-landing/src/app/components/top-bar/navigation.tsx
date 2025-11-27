import { Desktop } from './desktop';

type Properties = {
  isSticky?: boolean;
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
  displayMobileCTA?: boolean;
  creatorDonationPage?: string;
};

export const Navigation = ({
  isSticky,
  isLanding,
  displayCTA,
  hideNavigation,
  displayMobileCTA,
  creatorDonationPage,
}: Properties) => {
  return (
    <Desktop
      hideNavigation={hideNavigation}
      displayCTA={displayCTA}
      isSticky={isSticky}
      isLanding={isLanding}
      displayMobileCTA={displayMobileCTA}
      creatorDonationPage={creatorDonationPage}
    />
  );
};
