'use client';

import { classes } from '@idriss-xyz/ui/utils';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';

import { CREATORS_FORM, CREATORS_LINES } from '@/app/creators/landing/assets';
import { IDRISS_SCENE_STREAM } from '@/assets';

export const SetUp = () => {
  return (
    <div className="relative z-1 overflow-visible px-safe">
      <div
        className={classes(
          'container flex flex-col items-center justify-center py-10',
          'md:py-[60px]',
          'lg:py-[116px]',
          '4xl:py-[128px]',
        )}
      >
        <div className="flex w-full flex-col items-center">
          <div className="relative grid w-full gap-12 rounded-[40px] bg-[linear-gradient(113.57deg,_#022B1E_34.81%,_#079165_123.57%)] py-8 md:py-10 lg:grid-cols-[6fr,4fr] lg:gap-14 lg:py-0 xl:gap-16">
            <div
              className={classes(
                'flex flex-col items-start justify-center gap-10 px-4',
                'md:px-8',
                'lg:py-11 lg:pl-12',
                'xl:py-12 xl:pl-[56px]',
              )}
            >
              <span
                className={classes(
                  'flex items-start rounded-[100px] bg-mint-400 px-6 py-2 text-label4 text-neutralGreen-900',
                )}
              >
                3-minute setup
              </span>

              <div className="flex flex-col gap-6">
                <h2
                  className={classes(
                    'text-display5 uppercase text-white',
                    'md:text-display4',
                    'lg:text-display3',
                  )}
                >
                  SET UP IN JUST A FEW CLICKS
                </h2>

                <ul className="flex flex-col gap-6 text-neutralGreen-700">
                  <li className="flex flex-row items-center gap-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body5 text-midnightGreen-200 md:text-body4 lg:text-body3">
                      Create your donation link
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body5 text-midnightGreen-200 md:text-body4 lg:text-body3">
                      Add donation alerts to your OBS
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body5 text-midnightGreen-200 md:text-body4 lg:text-body3">
                      Boost visibility with a banner for your bio
                    </p>
                  </li>
                </ul>

                <Button
                  asLink
                  isExternal
                  size="large"
                  href="/creators"
                  intent="secondary"
                >
                  LEARN MORE
                </Button>
              </div>
            </div>

            <div
              className={classes(
                'relative size-full px-4',
                'md:px-8',
                'lg:py-11 lg:pr-12',
                'xl:py-12 xl:pr-[56px]',
              )}
            >
              <img
                alt=""
                src={CREATORS_FORM.src}
                className="relative z-1 block h-full max-h-[450px] object-contain md:max-h-[550px] lg:ml-auto lg:max-h-none"
              />

              <img
                alt=""
                src={CREATORS_LINES.src}
                className="absolute right-0 top-0 block h-full object-fill"
              />
            </div>
          </div>

          <img
            alt=""
            src={IDRISS_SCENE_STREAM.src}
            className="pointer-events-none absolute left-0 top-0 -z-10 size-full overflow-visible object-cover"
          />
        </div>
      </div>
    </div>
  );
};
