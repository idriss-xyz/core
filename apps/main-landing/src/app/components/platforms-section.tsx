import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { TopWave } from '@/components/superpowers-section/components/top-wave';
import { browserBasedSource } from '@/app/utils';

import {
  PLATFORMS_TOKEN_SVG,
  PLATFORMS_TOKEN_PNG,
} from './platforms-section/assets';

export const PlatformsSection = () => {
  return (
    <section className="relative bg-mint-100">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-12%] text-white" />

      <div className="relative overflow-hidden">
        <div className="z-1 py-10 px-safe lg:pb-20 lg:pt-[60px]">
          <div className="container relative grid items-center gap-x-8 gap-y-4 lg:grid-cols-[1fr,1fr]">
            <div className="flex w-full flex-col items-center gap-4 lg:items-start">
              <h2
                className={classes(
                  'w-full whitespace-pre-wrap text-display5 uppercase gradient-text',
                  'sm:whitespace-nowrap sm:text-center md:text-display4',
                  'lg:whitespace-pre-wrap lg:text-left lg:text-display3',
                )}
              >
                Get paid anywhere
                {'\n'}you create
              </h2>

              <p
                className={classes(
                  'text-body2 text-neutralGreen-900 opacity-70 sm:text-center lg:text-balance lg:text-left',
                )}
              >
                Whether you are on Twitch, YouTube, Kick, Facebook or anywhere
                else, you can start earning with IDRISS. All it takes is sharing
                a link with your audience.
              </p>
            </div>

            <div className="relative mx-auto mb-px max-w-[600px] rounded-[24px] px-2 py-10 lg:max-w-none lg:p-6">
              <GradientBorder gradientDirection="toTop" borderRadius={24} />

              <img
                alt=""
                className="w-full"
                src={browserBasedSource({
                  svgSrc: PLATFORMS_TOKEN_SVG.src,
                  pngSrc: PLATFORMS_TOKEN_PNG.src,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
