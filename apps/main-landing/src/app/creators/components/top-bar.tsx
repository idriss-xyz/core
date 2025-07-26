'use client';
import { useEffect, useState, useRef, RefObject } from 'react';
import Link from 'next/link';
import { classes } from '@idriss-xyz/ui/utils';

import { Navigation } from './top-bar/navigation';

const STICKY_CLASSES = 'bg-mint-200 border-b border-mint-300';

type Properties = {
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
  heroButtonReference?: RefObject<HTMLButtonElement>;
};

export const TopBar = ({
  isLanding,
  displayCTA,
  hideNavigation,
  heroButtonReference,
}: Properties) => {
  const [displayMobileCTA, setDisplayMobileCTA] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const topBarReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const customEvent = event as CustomEvent<{ scrollTop: number }>;

      const scrollTop = customEvent.detail.scrollTop;

      if (topBarReference.current) {
        const navbarHeight = topBarReference.current.offsetHeight;

        setIsSticky(scrollTop > navbarHeight);
      }

      if (heroButtonReference && displayCTA) {
        const navbarBounding = topBarReference.current?.getBoundingClientRect();
        const buttonBounding =
          heroButtonReference.current?.getBoundingClientRect();

        if (!navbarBounding || !buttonBounding) {
          return;
        }

        const isScrolledPastHeroButton =
          buttonBounding.top + buttonBounding.height - navbarBounding.height;

        setDisplayMobileCTA(isScrolledPastHeroButton <= 0);
      }
    };

    window.addEventListener('creatorsLandingPageScroll', handleScroll);

    return () => {
      window.removeEventListener('creatorsLandingPageScroll', handleScroll);
    };
  }, [displayCTA, heroButtonReference]);

  return (
    <div
      ref={topBarReference}
      className={classes(
        'sticky inset-x-0 top-0 mb-[-64px] w-full transition-colors duration-300 px-safe lg:-mb-20',
        isSticky ? 'z-stickyNavbar' : 'z-topBar',
        isSticky && STICKY_CLASSES,
      )}
    >
      <div className="container flex items-center justify-between gap-x-1 py-1 xs:gap-x-2 lg:py-3">
        <Link href="/creators">
          <img
            alt=""
            width={98}
            height={24}
            className={classes(
              'min-w-20',
              isSticky &&
                'min-w-[unset] max-w-[75px] xs:min-w-20 xs:max-w-none',
            )}
            src="/idriss-creators-dark-logo.svg"
          />
        </Link>

        <Navigation
          isSticky={isSticky}
          isLanding={isLanding}
          displayCTA={displayCTA}
          hideNavigation={hideNavigation}
          displayMobileCTA={displayMobileCTA}
        />
      </div>
    </div>
  );
};
