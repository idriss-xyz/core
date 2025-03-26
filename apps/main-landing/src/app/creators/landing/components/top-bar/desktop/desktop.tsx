import { Socials } from '@/components/top-bar/components/desktop/socials';

import { Menu } from './menu';

export const Desktop = () => {
  return (
    <>
      <Menu className="hidden md:flex" />
      <Socials className="hidden md:flex" />
    </>
  );
};
