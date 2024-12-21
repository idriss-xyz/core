'use client';

import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { useEffect, useState } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_TOKEN_SALE_END } from '../constants';

const targetDate = new Date(IDRISS_TOKEN_SALE_END);

export const TokenSaleCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, []);

  const updateCountdown = () => {
    const currentTime = new Date();
    const remainingTime = targetDate.getTime() - currentTime.getTime();

    if (remainingTime <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  };
  return (
    <div className="relative flex w-full flex-col items-center gap-5 rounded-2xl bg-white/20 px-4 py-6 md:px-10 md:py-8">
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        gradientDirection="toTop"
        gradientStartColor="#5FEB3C"
        gradientStopColor="rgba(255,255,255,1)"
      />
      <span
        className={classes(
          'text-center text-body4 text-neutralGreen-900',
          'lg:text-body2',
        )}
      >
        ENDS IN
      </span>
      <div className="flex justify-between self-stretch">
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span
            className={classes(
              'text-heading4 gradient-text',
              'lg:text-heading2',
              '2xl:text-heading3',
            )}
          >
            {timeRemaining.days}
          </span>
          <span
            className={classes(
              'text-center text-body4 text-neutralGreen-500',
              'lg:text-body2',
            )}
          >
            DAYS
          </span>
        </div>
        <span
          className={classes(
            'text-heading4 text-neutralGreen-900',
            'lg:text-heading3',
          )}
        >
          :
        </span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span
            className={classes(
              'text-heading4 gradient-text',
              'lg:text-heading2',
              '2xl:text-heading3',
            )}
          >
            {timeRemaining.hours}
          </span>
          <span
            className={classes(
              'text-center text-body4 text-neutralGreen-500',
              'lg:text-body2',
            )}
          >
            HRS
          </span>
        </div>
        <span
          className={classes(
            'text-heading4 text-neutralGreen-900',
            'lg:text-heading3',
          )}
        >
          :
        </span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span
            className={classes(
              'text-heading4 gradient-text',
              'lg:text-heading2',
              '2xl:text-heading3',
            )}
          >
            {timeRemaining.minutes}
          </span>
          <span
            className={classes(
              'text-center text-body4 text-neutralGreen-500',
              'lg:text-body2',
            )}
          >
            MIN
          </span>
        </div>
        <span
          className={classes(
            'text-heading4 text-neutralGreen-900',
            'lg:text-heading3',
          )}
        >
          :
        </span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span
            className={classes(
              'text-heading4 gradient-text',
              'lg:text-heading2',
              '2xl:text-heading3',
            )}
          >
            {timeRemaining.seconds}
          </span>
          <span
            className={classes(
              'text-center text-body4 text-neutralGreen-500',
              'lg:text-body2',
            )}
          >
            SEC
          </span>
        </div>
      </div>
      {/* Progress bar may be uncommented post sale */}
      {/* <div className="w-full">
        <ProgressBar
          progress={100}
          className={classes(
            'relative flex h-5 w-full items-center rounded-full border border-[#E3F8D9]/70 bg-[linear-gradient(90deg,_#EBFEF3_29.61%,_#D7F1E2_75.72%)] py-0.5 opacity-70',
            "after:absolute after:left-0 after:top-0 after:size-full after:blur-[5px] after:content-['']",
          )}
          indicatorClassName="rounded-full bg-[linear-gradient(94deg,_#2AD012_-11.21%,_#156A09_75.88%)] h-4"
        />
      </div>
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-[linear-gradient(94deg,_#2AD012_-11.21%,_#156A09_75.88%)] lg:size-5" />
          <span className="text-body4 text-neutral-800 lg:text-body2">
            Sold
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded-full bg-[linear-gradient(90deg,_#EBFEF3_29.61%,_#D7F1E2_75.72%)] opacity-70 lg:size-5" />
          <span className="text-body4 text-neutral-800 lg:text-body2">
            Total available
          </span>
        </div>
      </div> */}
    </div>
  );
};
