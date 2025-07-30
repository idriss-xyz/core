/* eslint-disable @next/next/no-img-element */
'use client';
import { MobileNotSupported } from '@idriss-xyz/ui/mobile-not-supported';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';
import { RefObject, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { backgroundLines } from '@/assets';

import { useAuth } from '../context/auth-context';
import { useStartEarningNavigation } from '../utils';

import { VideoPlayer } from './hero-section/video-player';
import { LoginModal } from './login-modal';

type Properties = {
  heroButtonReference?: RefObject<HTMLButtonElement>;
};

export const HeroSection = ({ heroButtonReference }: Properties) => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileNotSupportedOpen, setIsMobileNotSupportedOpen] =
    useState(false);

  const { isLoginModalOpen, setIsModalOpen, creator } = useAuth();
  const originalHandleStartEarningClick = useStartEarningNavigation();

  const handleStartEarningClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileNotSupportedOpen(true);

      return;
    }

    if (creator) {
      void originalHandleStartEarningClick();
    } else {
      void originalHandleStartEarningClick();
    }
  };

  useEffect(() => {
    const customToken = searchParameters.get('token');
    const name = searchParameters.get('name');
    const displayName = searchParameters.get('displayName');
    const pfp = searchParameters.get('pfp');
    const email = searchParameters.get('email');

    if (searchParameters.get('login')) {
      setIsModalOpen(true);
      router.replace('/creators', { scroll: false });
    }

    if (customToken) {
      setIsLoggingIn(true);
      setIsModalOpen(true);
      // Store Twitch info in sessionStorage to be picked up by the next page.
      if (name) {
        sessionStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      // Store the custom token where our PrivyProvider can find it.
      sessionStorage.setItem('custom-auth-token', customToken);
      // Redirect to the main app. The PrivyProvider will now automatically
      // use the token to authenticate the user.
    }
  }, [searchParameters, router, setIsLoggingIn, setIsModalOpen]);

  return (
    <header
      className={classes(
        'relative flex w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-4 pb-[40px] pt-[88px]',
        'lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pb-[80px] lg:pt-[160px]',
      )}
    >
      <link rel="preload" as="image" href={backgroundLines.src} />
      <img
        alt=""
        src={backgroundLines.src}
        className="pointer-events-none absolute top-0 hidden opacity-40 lg:block"
      />

      <div
        className={classes(
          'container mb-10 flex flex-col items-center gap-x-8 gap-y-10 px-0 lg:grid lg:grid-cols-[1fr,1fr]',
          'lg:mb-28',
          'xl:mb-32',
          '2xl:mb-24',
          '3xl:mb-16',
        )}
      >
        <div className="z-1 flex flex-col items-center gap-y-4 px-safe md:gap-y-8 lg:items-start">
          <h1
            className={classes(
              'my-0 whitespace-pre-wrap text-balance text-center text-display4 font-normal uppercase gradient-text',
              'md:text-display3',
              'lg:text-left xl:text-display2',
            )}
          >
            Make more
            {'\n'}Grow faster
            {'\n'}Take control
          </h1>

          <p
            className={classes(
              'text-balance text-center text-body2 text-neutralGreen-900 opacity-70',
              'lg:text-left',
            )}
          >
            Creator monetization app that helps you earn more with instant
            payouts and near-zero platform cuts.
          </p>

          <Button
            size="large"
            className="z-1"
            intent="primary"
            ref={heroButtonReference}
            aria-label="Start earning now"
            suffixIconName="IdrissArrowRight"
            onClick={handleStartEarningClick}
          >
            Start earning now
          </Button>
        </div>

        <div
          className={classes(
            'relative flex aspect-[17/10] max-h-[600px] w-full max-w-[1000px] flex-col items-center overflow-hidden rounded-2xl border border-mint-500 bg-neutral-900 object-center px-safe lg:aspect-[115/76] lg:max-h-none',
          )}
        >
          <VideoPlayer />
        </div>
      </div>
      <LoginModal
        isOpened={isLoginModalOpen}
        isLoading={isLoggingIn}
        onClose={() => {
          return setIsModalOpen(false);
        }}
      />
      {isMobileNotSupportedOpen && (
        <MobileNotSupported
          className="bg-[#E7F5E6]/[0.6] backdrop-blur-sm"
          onClose={() => {
            return setIsMobileNotSupportedOpen(false);
          }}
        >
          <p className="text-balance text-center text-heading5 text-neutralGreen-700">
            This experience is designed for desktop.
          </p>
          <p className="text-balance text-center text-heading5 text-neutralGreen-700">
            Please use a PC or a laptop.
          </p>
        </MobileNotSupported>
      )}
    </header>
  );
};
