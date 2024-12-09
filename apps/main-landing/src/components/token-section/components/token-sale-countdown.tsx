'use client';

import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { ProgressBar } from '@idriss-xyz/ui/progress-bar';
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
    <div className="relative flex w-full flex-col items-center gap-5 rounded-2xl bg-white/20 px-10 py-8">
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        gradientDirection="toTop"
        gradientStartColor="#5FEB3C"
        gradientStopColor="rgba(255,255,255,1)"
      />
      <span className="text-center text-body2 text-neutralGreen-900">
        ENDS IN
      </span>
      <div className="flex justify-between self-stretch">
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.days}
          </span>
          <span className="text-center text-body2 text-neutralGreen-500">
            DAYS
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.hours}
          </span>
          <span className="text-center text-body2 text-neutralGreen-500">
            HRS
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.minutes}
          </span>
          <span className="text-center text-body2 text-neutralGreen-500">
            MIN
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.seconds}
          </span>
          <span className="text-center text-body2 text-neutralGreen-500">
            SEC
          </span>
        </div>
      </div>
      <div className="w-full">
        <ProgressBar
          progress={15}
          className={classes(
            'relative flex h-5 w-full items-center rounded-full border border-[#E3F8D9]/70 bg-[linear-gradient(90deg,_#EBFEF3_29.61%,_#D7F1E2_75.72%)] py-0.5 opacity-70',
            "after:absolute after:left-0 after:top-0 after:size-full after:blur-[5px] after:content-['']",
          )}
          indicatorClassName="rounded-full bg-[linear-gradient(94deg,_#2AD012_-11.21%,_#156A09_75.88%)] h-4"
        />
      </div>
      <div className="flex justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-[linear-gradient(94deg,_#2AD012_-11.21%,_#156A09_75.88%)]" />
          <span className="text-body1 text-neutral-800">Sold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-[linear-gradient(90deg,_#EBFEF3_29.61%,_#D7F1E2_75.72%)] opacity-70 " />
          <span className="text-body1 text-neutral-800">Total available</span>
        </div>
      </div>
    </div>
  );
};
