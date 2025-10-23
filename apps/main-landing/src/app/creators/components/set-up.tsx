'use client';

import { classes } from '@idriss-xyz/ui/utils';
import { Button } from '@idriss-xyz/ui/button';
import { Icon } from '@idriss-xyz/ui/icon';
import { CREATORS_USER_GUIDE_LINK } from '@idriss-xyz/constants';

import { IDRISS_SCENE_STREAM } from '@/assets';

import {
  CREATORS_LINES,
  CREATORS_LINES_MOBILE,
  CREATORS_LINES_TABLET,
  CRETORS_FORM_MOBILE_PNG,
  CRETORS_FORM_MOBILE_SVG,
  CRETORS_FORM_PNG,
  CRETORS_FORM_SVG,
} from './set-up-section/assets';

import { browserBasedSource } from '@/app/utils';


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
          <div className="relative grid w-full gap-x-12 gap-y-10 overflow-hidden bg-[linear-gradient(113.57deg,_#022B1E_34.81%,_#079165_123.57%)] pt-8 md:pt-10 lg:grid-cols-[5.5fr,4.5fr] lg:gap-14 lg:rounded-[40px] lg:py-0 xl:gap-16">
            <div
              className={classes(
                'flex flex-col items-start justify-center gap-y-8 px-4',
                'sm:items-center',
                'lg:items-start lg:py-11 lg:pl-12 lg:pr-0',
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

              <div
                className={classes(
                  'flex flex-col gap-y-6',
                  'sm:items-center',
                  'lg:items-start',
                )}
              >
                <h2
                  className={classes(
                    'whitespace-pre-wrap text-display5 uppercase text-midnightGreen-100',
                    'sm:whitespace-nowrap',
                    'md:text-display4',
                    'lg:whitespace-pre-wrap lg:text-display3',
                  )}
                >
                  Set up in just{'\n'}
                  a&nbsp;few clicks
                </h2>

                <ul
                  className={classes(
                    'flex flex-col flex-wrap gap-x-3 gap-y-6',
                    'sm:flex-row sm:justify-center',
                    'lg:flex-col lg:justify-start',
                  )}
                >
                  <li className="flex flex-row items-center gap-x-4 sm:gap-x-2 lg:gap-x-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body3 text-midnightGreen-200">
                      Create your donation link
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-x-4 sm:gap-x-2 lg:gap-x-4">
                    <Icon size={22} name="Hexagon" className="text-mint-400" />

                    <p className="text-body3 text-midnightGreen-200">
                      Add donation alerts to your OBS
                    </p>
                  </li>

                  <li className="flex flex-row items-center gap-x-4 sm:gap-x-2 lg:gap-x-4">
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
                src={browserBasedSource({
                  svgSrc: CRETORS_FORM_SVG.src,
                  pngSrc: CRETORS_FORM_PNG.src,
                })}
                className="relative z-1 ml-auto hidden h-full max-h-[600px] object-contain lg:block"
              />

              <img
                alt=""
                src={browserBasedSource({
                  svgSrc: CRETORS_FORM_MOBILE_SVG.src,
                  pngSrc: CRETORS_FORM_MOBILE_PNG.src,
                })}
                className="relative z-1 mx-auto block h-full max-h-[600px] object-contain px-4 lg:hidden"
              />

              <img
                alt=""
                src={CREATORS_LINES_MOBILE.src}
                className="absolute inset-x-0 top-0 block w-full object-contain sm:hidden"
              />

              <img
                alt=""
                src={CREATORS_LINES_TABLET.src}
                className="absolute inset-x-0 top-0 hidden w-full object-contain sm:block lg:hidden"
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
