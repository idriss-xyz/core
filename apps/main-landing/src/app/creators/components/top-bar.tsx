'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { classes } from '@idriss-xyz/ui/utils';

import { Navigation } from './top-bar/navigation';

const STICKY_CLASSES = 'bg-mint-200 border-b border-mint-300';

type Properties = {
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
};

export const TopBar = ({
  isLanding,
  displayCTA,
  hideNavigation,
}: Properties) => {
  const [isSticky, setIsSticky] = useState(false);
  const topBarReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const customEvent = event as CustomEvent<{ scrollTop: number }>;

      if (topBarReference.current) {
        const navbarHeight = topBarReference.current.offsetHeight;

        if (customEvent.detail.scrollTop > navbarHeight) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('creatorsLandingPageScroll', handleScroll);

    return () => {
      window.removeEventListener('creatorsLandingPageScroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={topBarReference}
      className={classes(
        'sticky inset-x-0 top-0 z-topBar mb-[-64px] w-full transition-all duration-300 px-safe lg:-mb-20',
        isSticky && STICKY_CLASSES,
      )}
    >
      <div className="container flex items-center justify-between py-1 lg:py-3">
        <Link href="/">
          <img src="/idriss-dark-logo.svg" height={24} width={98} alt="" />
        </Link>

        <Navigation
          isSticky={isSticky}
          isLanding={isLanding}
          displayCTA={displayCTA}
          hideNavigation={hideNavigation}
        />
      </div>
    </div>
  );
};
