import { Desktop } from './desktop';
import { Mobile } from './mobile';

type Properties = {
  hideNavigation?: boolean;
};

export const Navigation = ({ hideNavigation }: Properties) => {
  return (
    <>
      <Mobile hideNavigation={hideNavigation} />
      <Desktop hideNavigation={hideNavigation} />
    </>
  );
};
