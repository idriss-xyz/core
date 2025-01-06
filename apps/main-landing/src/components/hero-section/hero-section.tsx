/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';

import { backgroundLines } from '@/assets';
import { INTERNAL_LINK } from '@/constants';

import tokensFlow from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import { CollaborationsShowcase } from './components';

export const HeroSection = () => {
  return (
    <header
      className={classes(
        'relative flex w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] pb-[60px] pt-[104px]',
        'lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pb-[80px] lg:pt-[200px]',
      )}
    >
      <link rel="preload" as="image" href={backgroundLines.src} />
      <img
        src={backgroundLines.src}
        className="pointer-events-none absolute top-0 hidden opacity-40 lg:block"
        alt=""
      />
      <div className="z-1 px-safe">
        <h1
          className={classes(
            'container my-0 text-balance text-center text-display4 font-normal gradient-text lg:text-display2',
            '2xl:text-[100px] 2xl:leading-[116px]',
            '4xl:text-display1',
          )}
        >
          APPS UNIQUELY ENABLED BY CRYPTO AND AI
        </h1>
      </div>
      <Button
        aria-label="Get started"
        intent="primary"
        size="large"
        className="z-1 my-9 lg:mb-0 lg:mt-9"
        suffixIconName="IdrissArrowRight"
        asLink
        href={INTERNAL_LINK.SUPERPOWERS}
      >
        EXPLORE
      </Button>
      <link rel="preload" as="image" href={tokensFlow.src} />
      <img
        data-blurdataul={tokensFlow.src}
        data-placeholder="blur"
        src={tokensFlow.src}
        className={classes(
          'pointer-events-none z-0 mt-[-40%] w-full min-w-[600px]',
          '[@media(max-width:768px)]:[@media(min-width:470px)]:mt-[-30%]',
          'md:mt-[-25%]',
          'lg:mt-[-33%] lg:min-w-[1985px]',
          '2xl:mt-[-30%]',
          '3xl:mt-[-29%]',
          '4xl:mt-[-24%] 4xl:min-w-[unset]',
        )}
        alt=""
      />
      <div
        className={classes(
          'mt-[-6%] px-safe md:mb-10 lg:mb-14',
          'md:mt-[-5%]',
          'lg:mt-[-14%]',
          '3xl:mt-[-12%]',
          '4xl:mt-[-9%]',
        )}
      >
        <CollaborationsShowcase className="container text-center" />
      </div>
    </header>
  );
};
