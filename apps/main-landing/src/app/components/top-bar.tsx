'use client';
import { useEffect, useState, useRef, RefObject } from 'react';
import Link from 'next/link';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';

import { Navigation } from './top-bar/navigation';
import { Avatar } from './avatar/avatar';

const STICKY_CLASSES = 'bg-mint-200 border-b border-mint-300';

type Properties = {
  isLanding?: boolean;
  displayCTA?: boolean;
  hideNavigation?: boolean;
  heroButtonReference?: RefObject<HTMLButtonElement>;
  referrerName?: string | null;
  referrerProfilePictureUrl?: string | null;
};

export const TopBar = ({
  isLanding,
  displayCTA,
  hideNavigation,
  heroButtonReference,
  referrerName,
  referrerProfilePictureUrl,
}: Properties) => {
  const [displayMobileCTA, setDisplayMobileCTA] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const topBarReference = useRef<HTMLDivElement | null>(null);

  const InvitedByBanner = () => {
    return (
      <div className="w-full items-center bg-white px-safe">
        <div className="container flex max-h-12 items-center gap-x-2 py-1 sm:gap-x-2 lg:py-3">
          <div className="shrink-0">
            <Avatar src={referrerProfilePictureUrl ?? undefined} size={32} />
          </div>
          <span className="flex flex-wrap text-label5 uppercase leading-tight gradient-text">
            <span className="mr-2 break-words">{referrerName}</span>
            <span className="inline-flex shrink-0 items-center">
              <Icon name="Send" className="mr-2 text-mint-600" size={16} />
              invites you to join!
            </span>
          </span>
        </div>
      </div>
    );
  };

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
        'sticky inset-x-0 top-0 w-full transition-colors duration-300 px-safe',
        isSticky ? 'z-stickyNavbar' : 'z-topBar',
        isSticky && STICKY_CLASSES,
        // Adjust negative margin based on whether banner is present
        referrerName ? 'mb-[-104px] lg:mb-[-128px]' : 'mb-[-64px] lg:-mb-20',
      )}
    >
      <div className="container flex items-center justify-between gap-x-1 py-1 xs:gap-x-2 lg:py-3">
        <Link href="/">
          <img
            alt=""
            width={98}
            height={24}
            className={classes(
              'min-w-20',
              isSticky &&
                'min-w-[unset] max-w-[75px] xs:min-w-20 xs:max-w-none',
            )}
            src="/idriss-dark-logo.svg"
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

      {referrerName && <InvitedByBanner />}
    </div>
  );
};
