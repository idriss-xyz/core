'use client';

import { classes } from '@idriss-xyz/ui/utils';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { CREATORS_USER_GUIDE_LINK } from '@idriss-xyz/constants';

import { IDRISS_SCENE_STREAM } from '@/assets';

import {
  CREATORS_FORM,
  CREATORS_LINES,
  CREATORS_LINES_MOBILE,
} from '../assets';

export const SetUp = () => {
  return (
    <div className="relative z-1 overflow-visible px-safe">
      <div
        className={classes(
          'flex flex-col items-center justify-center lg:container',
          'lg:pt-20',
        )}
      >
        <div className="flex w-full flex-col items-center">
          <div className="relative grid w-full gap-x-12 gap-y-10 bg-[linear-gradient(113.57deg,_#022B1E_34.81%,_#079165_123.57%)] pt-8 md:pt-10 lg:grid-cols-[5.5fr,4.5fr] lg:gap-14 lg:rounded-[40px] lg:py-0 xl:gap-16">
            <div
              className={classes(
                'flex flex-col items-start justify-center gap-y-8 px-4',
                'lg:py-11 lg:pl-12 lg:pr-0',
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

              <div className="flex flex-col gap-y-6">
                <h2
                  className={classes(
                    'whitespace-pre-wrap text-display5 uppercase text-midnightGreen-100',
                    'md:text-display4',
                    'lg:text-display3',
                  )}
                >
                  Set up in just{'\n'}
                  a&nbsp;few clicks
                </h2>

                <ul className="flex flex-col gap-y-6">
                  <li className="flex flex-row items-center gap-x-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body3 text-midnightGreen-200">
                      Create your donation link
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-x-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body3 text-midnightGreen-200">
                      Add donation alerts to your OBS
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-x-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body3 text-midnightGreen-200">
                      Boost visibility with a banner for your bio
                    </p>
                  </li>
                </ul>

                <Button
                  asLink
                  isExternal
                  size="large"
                  intent="secondary"
                  href={CREATORS_USER_GUIDE_LINK}
                  suffixIconName="IdrissArrowRight"
                  className="uppercase"
                >
                  Learn more
                </Button>
              </div>
            </div>

            <div
              className={classes(
                'size-full pb-8 pt-[168px] md:pb-10',
                'lg:py-11 lg:pr-12',
                'relative xl:py-12 xl:pr-[56px]',
              )}
            >
              <img
                alt=""
                src={CREATORS_FORM.src}
                className="relative z-1 block h-full max-h-[550px] object-contain px-4 lg:ml-auto lg:max-h-none lg:px-0"
              />

              <img
                alt=""
                src={CREATORS_LINES_MOBILE.src}
                className="absolute inset-x-0 top-0 block w-full max-w-[450px] object-contain lg:hidden"
              />

              <img
                alt=""
                src={CREATORS_LINES.src}
                className="absolute right-0 top-0 hidden h-full object-contain lg:block"
              />
            </div>
          </div>

          <img
            alt=""
            src={IDRISS_SCENE_STREAM.src}
            className="pointer-events-none absolute left-0 top-0 -z-10 hidden size-full overflow-visible object-cover lg:block"
          />
        </div>
      </div>
    </div>
  );
};
