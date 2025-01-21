import Link from 'next/link';

import { Navigation } from './components';

export const TopBar = () => {
  return (
    <div className="absolute inset-x-0 top-0 z-topBar w-full px-safe">
      <div className="container flex items-center justify-between py-1 lg:py-3">
        <Link href="/">
          <img src="/idriss-dark-logo.svg" height={24} width={98} alt="" />
        </Link>
        <Navigation />
      </div>
    </div>
  );
};
