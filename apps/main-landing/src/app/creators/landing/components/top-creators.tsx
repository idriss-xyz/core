'use client';

import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_SCENE_STREAM } from '@/assets';
import { TopCreatorsShowcase } from '@/app/creators/landing/components/top-creators-section/top-creators-showcase';

export const TopCreators = () => {
  return (
    <div className="relative z-1 overflow-visible px-safe">
      <div
        className={classes(
          'container flex flex-col items-center justify-center gap-y-8 py-10',
          'md:py-[60px]',
          'lg:py-[96px]',
        )}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <h2
            className={classes(
              'text-center text-display5 uppercase gradient-text',
              'md:text-display4',
              'lg:text-display3',
            )}
          >
            Trusted by top creators
          </h2>

          <p
            className={classes(
              'text-balance text-center text-body4 text-neutralGreen-900',
              'md:text-body3',
              'lg:text-body2',
            )}
          >
            Join a growing community of creators taking control of their
            earnings.
          </p>
        </div>

        <TopCreatorsShowcase />

        <img
          alt=""
          src={IDRISS_SCENE_STREAM.src}
          className="pointer-events-none absolute left-0 top-0 -z-10 size-full overflow-visible object-cover"
        />
      </div>
    </div>
  );
};
