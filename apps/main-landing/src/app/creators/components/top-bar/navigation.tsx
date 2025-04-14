import { Desktop } from './desktop';
import { Mobile } from './mobile';

type Properties = {
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const Navigation = ({ hideNavigation, displayCTA }: Properties) => {
  return (
    <>
      <Mobile hideNavigation={hideNavigation} />
      <Desktop hideNavigation={hideNavigation} displayCTA={displayCTA} />
    </>
  );
};
