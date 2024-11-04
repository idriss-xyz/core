import { Menu } from './menu';
import { Socials } from './socials';

export const Desktop = () => {
  return (
    <>
      <Menu className="hidden lg:flex" />
      <Socials className="hidden lg:flex" />
    </>
  );
};
