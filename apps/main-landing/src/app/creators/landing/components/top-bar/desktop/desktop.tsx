import { Menu } from './menu';
import { Socials } from './socials';

type Properties = {
  hideNavigation?: boolean;
};

export const Desktop = ({ hideNavigation }: Properties) => {
  return (
    <>
      {!hideNavigation && <Menu className="hidden md:flex" />}
      <Socials className="hidden md:flex" />
    </>
  );
};
