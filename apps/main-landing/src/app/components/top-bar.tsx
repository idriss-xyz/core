'use client';
import { useEffect, useState, useRef, RefObject } from 'react';
import Link from 'next/link';
import { classes } from '@idriss-xyz/ui/utils';

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
  creatorDonationPage?: string;
  stickyEnabled?: boolean;
};

export const TopBar = ({
  isLanding,
  displayCTA,
  hideNavigation,
  heroButtonReference,
  referrerName,
  referrerProfilePictureUrl,
  creatorDonationPage,
  stickyEnabled = true,
}: Properties) => {
  const [displayMobileCTA, setDisplayMobileCTA] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const topBarReference = useRef<HTMLDivElement | null>(null);

  const InvitedByBanner = () => {
    return (
      <div
        className="flex w-full items-center bg-white px-safe"
        style={{
          borderWidth: '1.11px 0',
          borderStyle: 'solid',
          borderImageSlice: 1,
          borderImageSource:
            'linear-gradient(180deg, rgba(145, 206, 154, 0.5) 0%, #55EB3C 99.33%)',
          borderColor: '#55EB3C',
        }}
      >
        <div className="container flex max-h-12 items-center gap-x-2 py-1 sm:gap-x-2 lg:py-3">
          <div className="shrink-0">
            <Avatar src={referrerProfilePictureUrl ?? undefined} size={32} />
          </div>
          <span className="flex flex-wrap items-center text-label5 uppercase leading-tight gradient-text">
            <span className="mr-2 break-words">{referrerName}</span>
            <svg
              className="mr-2 shrink-0"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#05AB13"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.24l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
              <path d="m21.854 2.147-10.94 10.939" />
            </svg>
            <span className="shrink-0">invites you to join!</span>
          </span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!stickyEnabled) return;
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
  }, [displayCTA, heroButtonReference, stickyEnabled]);

  return (
    <div
      ref={topBarReference}
      className={classes(
        stickyEnabled ? 'sticky inset-x-0 top-0' : 'relative',
        'w-full transition-colors duration-300 px-safe',
        stickyEnabled ? (isSticky ? 'z-stickyNavbar' : 'z-topBar') : 'z-topBar',
        stickyEnabled && isSticky && STICKY_CLASSES,
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
          creatorDonationPage={creatorDonationPage}
        />
      </div>

      {referrerName && <InvitedByBanner />}
    </div>
  );
};
