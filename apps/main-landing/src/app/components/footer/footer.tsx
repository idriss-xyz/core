/* eslint-disable @next/next/no-img-element */
'use client';
import { Link } from '@idriss-xyz/ui/link';
import { Button } from '@idriss-xyz/ui/button';
import {
  PRIVACY_POLICY_LINK,
  TERMS_OF_SERVICE_LINK,
} from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';

import {
  EXTERNAL_RESOURCES,
  idrissHalfTransparent,
  Section,
  SOCIALS,
} from '@/components/footer';

import { useStartEarningNavigation } from '../../utils';

export const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();
  const handleStartEarningClick = useStartEarningNavigation();

  return (
    <footer
      className={classes(
        'relative z-1 overflow-x-hidden bg-mint-100 p-2.5',
        'lg:z-10 lg:p-0',
        '4xl:z-40',
      )}
    >
      <div className="px-safe">
        <div
          className={classes(
            'container pt-10',
            'lg:grid lg:grid-cols-2 lg:gap-6 lg:pb-40 lg:pt-20',
            '3xl:grid 3xl:grid-cols-[810px_auto]',
            '4xl:grid 4xl:grid-cols-[1260px_auto]',
          )}
        >
          <div className={classes('flex flex-col items-start')}>
            <h2
              className={classes(
                'whitespace-pre-wrap text-balance text-display6 uppercase text-neutral-900',
                'lg:text-display3',
              )}
            >
              Make more
              {'\n'}Grow faster
              {'\n'}Take control
            </h2>
            <Button
              intent="negative"
              size="medium"
              prefixIconName="BadgeDollarSign"
              className="mt-6 uppercase lg:mt-10"
              onClick={handleStartEarningClick}
            >
              Start earning now
            </Button>
          </div>

          <div
            className={classes(
              'mt-6 grid grid-cols-[auto,_1fr] gap-6',
              'sm:grid-cols-2',
              'lg:mt-0',
            )}
          >
            <Section title="RESOURCES" items={EXTERNAL_RESOURCES} />
            <Section title="SOCIALS" items={SOCIALS} />
          </div>
        </div>
      </div>
      <img
        src={idrissHalfTransparent.src}
        className={classes(
          'pointer-events-none -mx-2.5 my-2.5 max-w-[100vw]',
          'lg:max-w-[calc(100%_-20px)]) lg:absolute lg:inset-x-2.5 lg:bottom-0 lg:m-0',
          '2xl:mb-[125px] 2xl:w-[1412px]',
          '3xl:mb-[115px] 3xl:w-[1505px]',
          '4xl:mb-[30px] 4xl:w-[1887px]',
        )}
        alt=""
      />
      <div className="border-t border-t-[#002D1E4D] px-safe">
        <div
          className={classes(
            'container justify-between gap-x-6 py-10',
            'lg:mt-10 lg:grid lg:grid-cols-[repeat(3,1fr)]',
          )}
        >
          <img
            className="mb-6 lg:mb-0"
            src="/idriss-dark-logo.svg"
            height={24}
            width={98}
            alt=""
          />
          <p
            className={classes(
              'mb-4 whitespace-nowrap text-body5 text-neutralGreen-700 opacity-60',
              'lg:mb-0 lg:text-center lg:text-body4',
            )}
          >
            Copyright © {year} IDRISS. All rights reserved.
          </p>
          <div className={classes('lg:flex lg:gap-x-8', 'xl:gap-x-0')}>
            <div className="ml-auto flex items-center space-x-2 lg:col-span-2 lg:col-start-2">
              <Link
                size="medium"
                href={PRIVACY_POLICY_LINK}
                className="whitespace-nowrap"
                isExternal
              >
                Privacy policy
              </Link>
              <span className="text-neutralGreen-900/20">•</span>
              <Link
                size="medium"
                className="whitespace-nowrap"
                href={TERMS_OF_SERVICE_LINK}
                isExternal
              >
                Terms of service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
