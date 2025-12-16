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
      <div className="z-1 flex flex-col items-center gap-4 text-center px-safe md:gap-8">
        <h1
          className={classes(
            'container my-0 text-balance text-center text-display4 font-normal gradient-text lg:text-display2',
            '2xl:text-[100px] 2xl:leading-[116px]',
            '4xl:text-display1',
          )}
        >
          IDRISS DAO
        </h1>
        <span className="text-center text-body2 text-neutralGreen-900/70">
          The decentralized organization overseeing the economy <br />
          and governance of the IDRISS app.
        </span>
        <Button
          aria-label="Get started"
          intent="primary"
          size="large"
          className="z-1 lg:mb-0"
          suffixIconName="IdrissArrowRight"
          asLink
          href={INTERNAL_LINK.SUPERPOWERS}
        >
          EXPLORE
        </Button>
      </div>
      <link rel="preload" as="image" href={tokensFlow.src} />
      <img
        data-blurdataul={tokensFlow.src}
        data-placeholder="blur"
        src={tokensFlow.src}
        className={classes(
          'pointer-events-none z-0 mt-[-40%] w-full min-w-[600px]',
          '[@media(max-width:768px)]:[@media(min-width:470px)]:mt-[-30%]',
          'md:mt-[-25%]',
          'lg:mt-[-33%] lg:min-w-[1024px] lg:pb-28 lg:pt-36',
          'xl:pb-32',
          '2xl:mt-[-30%] 2xl:pb-24 2xl:pt-28',
          '3xl:mt-[-29%] 3xl:pb-16 3xl:pt-24',
          '4xl:mt-[-24%] 4xl:min-w-[unset] 4xl:pb-8 4xl:pt-10',
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
