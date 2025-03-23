/* eslint-disable @next/next/no-img-element */
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { TopWave } from '@/components/superpowers-section/components/top-wave';
import { IDRISS_ICON_STREAMING } from '@/app/creators/landing/assets';

export const SupportSection = () => {
  return (
    <section className="relative bg-mint-100">
      <TopWave className="absolute left-0 top-0 z-0 w-full translate-y-[-12%] text-white" />

      <div className="relative overflow-hidden">
        <div className="z-1 py-10 pt-20 px-safe lg:py-[60px]">
          <div className="container relative grid items-center gap-6 lg:grid-cols-[5fr,6fr]">
            <div className="flex w-full flex-col items-center gap-4 lg:items-start">
              <h2
                className={classes(
                  'text-center text-display5 uppercase gradient-text lg:text-left',
                  'md:text-display4',
                  'lg:text-display3',
                )}
              >
                Compatible & Supportive
              </h2>

              <p
                className={classes(
                  'text-balance text-center text-body3 text-neutralGreen-900 opacity-70 lg:text-left',
                  'lg:text-body2',
                  '4xl:text-body1',
                )}
              >
                Our platform seamlessly integrates with popular streaming
                services, always staying in line with their guidelines. No
                matter where you stream, we&#39;re here to support your growth.
              </p>
            </div>

            <div className="relative mx-auto mb-px max-w-[600px] rounded-[24px] p-6 lg:max-w-none">
              <GradientBorder gradientDirection="toTop" borderRadius={24} />

              <img src={IDRISS_ICON_STREAMING.src} className="w-full" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
