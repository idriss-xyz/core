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
        'relative flex w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-4 pb-[40px] pt-[104px]',
        'lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pb-[80px] lg:pt-[160px]',
      )}
    >
      <link rel="preload" as="image" href={backgroundLines.src} />
      <img
        src={backgroundLines.src}
        className="pointer-events-none absolute top-0 hidden opacity-40 lg:block"
        alt=""
      />

      <div
        className={classes(
          'container mb-10 flex flex-col items-center gap-6 lg:grid lg:grid-cols-[1fr,1fr]',
          'lg:mb-28',
          'xl:mb-32',
          '2xl:mb-24',
          '3xl:mb-16',
        )}
      >
        <div className="z-1 flex flex-col items-center gap-y-8 px-safe lg:items-start">
          <h1
            className={classes(
              'container my-0 text-balance text-center text-display4 font-normal uppercase gradient-text',
              'md:text-display3',
              'lg:text-left lg:text-display2',
            )}
          >
            Make More Grow Faster TAKE CONTROL
          </h1>

          <p
            className={classes(
              'text-balance text-center text-body4 text-neutralGreen-900 opacity-70',
              'lg:text-body3',
              'lg:text-left lg:text-body2',
            )}
          >
            Creator monetization app that helps you earn more with instant
            payouts and near-zero platform cuts.
          </p>

          <Button
            aria-label="Start earning now"
            intent="primary"
            size="large"
            className="z-1"
            suffixIconName="IdrissArrowRight"
            asLink
            href={INTERNAL_LINK.SUPERPOWERS}
          >
            START EARNING NOW
          </Button>
        </div>

        <div
          className={classes(
            'relative flex aspect-[115/76] w-full max-w-[1000px] flex-col items-center gap-2 overflow-hidden rounded-2xl border border-mint-500 bg-neutral-900 px-safe',
          )}
        >
          <VideoPlayer />
        </div>
      </div>
    </header>
  );
};
