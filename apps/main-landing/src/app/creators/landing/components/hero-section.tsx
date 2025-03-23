/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';

import { backgroundLines } from '@/assets';
import { INTERNAL_LINK } from '@/constants';

import { VideoPlayer } from './hero-section/video-player';

export const HeroSection = () => {
  return (
    <header
      className={classes(
        'relative flex w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-4 pb-[60px] pt-[104px]',
        'lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pb-[80px] lg:pt-[200px]',
      )}
    >
      <link rel="preload" as="image" href={backgroundLines.src} />
      <img
        src={backgroundLines.src}
        className="pointer-events-none absolute top-0 hidden opacity-40 lg:block"
        alt=""
      />

      <div className="z-1 flex flex-col items-center gap-y-8 px-safe">
        <h1
          className={classes(
            'container my-0 text-balance text-center text-display4 font-normal uppercase gradient-text',
            'lg:text-display2',
            '2xl:text-[100px] 2xl:leading-[116px]',
            '4xl:text-display1',
          )}
        >
          Monetize your content everywhere you create
        </h1>

        <p className="max-w-[940px] text-balance text-center text-body3 text-neutralGreen-900 opacity-70 lg:text-body2 4xl:text-body1">
          Get instant donations in your favorite cryptocurrencies and unlock new
          ways to grow on Twitch, YouTube, and more.
        </p>
      </div>

      <Button
        aria-label="Get started"
        intent="primary"
        size="large"
        className="z-1 my-8 lg:mb-0 lg:mt-8"
        suffixIconName="IdrissArrowRight"
        asLink
        href={INTERNAL_LINK.SUPERPOWERS}
      >
        START USING NOW
      </Button>

      <div
        className={classes(
          'relative mt-8 flex aspect-[1000/550] w-full max-w-[1000px] flex-col items-center gap-2 overflow-hidden rounded-[40px] border border-mint-500 bg-neutral-900 px-safe',
          'lg:mb-28',
          'xl:mb-32',
          '2xl:mb-24',
          '3xl:mb-16',
          '4xl:mb-8',
        )}
      >
        <VideoPlayer />
      </div>
    </header>
  );
};
