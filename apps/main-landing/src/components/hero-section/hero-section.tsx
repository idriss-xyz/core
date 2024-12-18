'use client';
import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import { classes } from '@idriss-xyz/ui/utils';

import { backgroundLines } from '@/assets';
import { INTERNAL_LINK } from '@/constants';

import tokensFlow from './assets/IDRISS_SCENE_STREAM_4_2 1.png';
import tokensFlowLowResolution from './assets/IDRISS_SCENE_STREAM_4_2 1_LOW_RES.png';
import { CollaborationsShowcase } from './components';

export const HeroSection = () => {
  return (
    <header className="relative flex w-full flex-col items-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] pb-[60px] pt-[104px] lg:bg-[radial-gradient(222.94%_366.93%_at_16.62%_20%,_#E7F5E7_0%,_#76C282_100%)] lg:pb-[120px] lg:pt-[200px]">
      <Image
        priority
        src={backgroundLines}
        className="pointer-events-none absolute top-0 hidden opacity-40 lg:block"
        alt=""
      />
      <h1 className="container z-1 my-0 text-balance text-center text-display4 font-normal gradient-text lg:text-display1">
        APPS UNIQUELY ENABLED BY CRYPTO AND AI
      </h1>
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
      <Image
        priority
        blurDataURL={tokensFlowLowResolution.src}
        placeholder="blur"
        src={tokensFlow}
        className={classes(
          'pointer-events-none z-0 mt-[-40%] w-full min-w-[600px]',
          '[@media(max-width:703px)]:[@media(min-width:470px)]:mt-[-30%]',
          'md:mt-[-25%]',
          'lg:mt-[-24%]',
        )}
        alt=""
      />
      <CollaborationsShowcase
        className={classes(
          'container mt-[-6%] text-center md:mb-10 lg:mb-14',
          'md:mt-[-5%]',
          'lg:mt-[-10%]',
        )}
      />
    </header>
  );
};
