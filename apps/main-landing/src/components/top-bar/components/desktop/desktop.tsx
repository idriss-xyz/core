import { Menu } from './menu';
import { Socials } from './socials';

export const Desktop = () => {
  return (
    <>
      <Menu className="hidden md:flex" />
      <Socials className="hidden md:flex" />
    </>
  );
};
