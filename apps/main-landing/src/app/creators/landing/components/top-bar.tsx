/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { Navigation } from './top-bar/navigation';

type Properties = {
  hideNavigation?: boolean;
};

export const TopBar = ({ hideNavigation }: Properties) => {
  return (
    <div className="absolute inset-x-0 top-0 z-topBar w-full px-safe">
      <div className="container flex items-center justify-between py-1 lg:py-3">
        <Link href="/">
          <img src="/idriss-dark-logo.svg" height={24} width={98} alt="" />
        </Link>
        <Navigation hideNavigation={hideNavigation} />
      </div>
    </div>
  );
};
