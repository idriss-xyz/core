'use client';

import { classes } from '@idriss-xyz/ui/utils';

import {
  IDRISS_SCENE_STREAM_SHORT,
  IDRISS_SCENE_STREAM_SHORT_2,
} from '@/assets';

import { TopCreatorsShowcase } from './top-creators-section/top-creators-showcase';

export const TopCreators = () => {
  return (
    <div className="relative z-1 overflow-x-hidden overflow-y-visible px-safe">
      <div
        className={classes(
          'flex flex-col items-center justify-center gap-y-4 py-24 pb-10 lg:gap-y-8 lg:py-10',
          'md:py-[60px]',
          'lg:py-[96px]',
        )}
      >
        <div className="container flex w-full flex-col items-center gap-4">
          <h2
            className={classes(
              'text-center text-display5 uppercase gradient-text',
              'md:text-display4',
              'lg:text-display3',
            )}
          >
            Trusted by top streamers
          </h2>

          <p
            className={classes(
              'text-center text-body2 text-neutralGreen-900/70 lg:text-balance',
            )}
          >
            Join a growing community of streamers taking control of their
            earnings.
          </p>
        </div>

        <TopCreatorsShowcase />

        <TopCreatorsShowcase offset={2} reverse className="md:hidden" />

        <img
          alt=""
          src={IDRISS_SCENE_STREAM_SHORT.src}
          className="pointer-events-none absolute -right-40 -top-10 -z-10 hidden aspect-[11/10] h-[500px] w-[550px] overflow-visible object-contain lg:block"
        />

        <img
          alt=""
          src={IDRISS_SCENE_STREAM_SHORT_2.src}
          className="pointer-events-none absolute -right-40 top-[-180px] -z-10 aspect-[11/10] h-[360px] w-[396px] rotate-[60.42deg] overflow-visible object-cover lg:hidden"
        />
      </div>
    </div>
  );
};
