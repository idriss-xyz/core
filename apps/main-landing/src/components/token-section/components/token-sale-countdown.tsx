'use client';

import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { useEffect, useState } from 'react';

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
    <div className="relative flex w-full flex-col items-center gap-5 rounded-2xl bg-white/20 p-6">
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        gradientDirection="toTop"
        gradientStartColor="#5FEB3C"
        gradientStopColor="rgba(255,255,255,1)"
      />
      <span className="text-center text-body2 text-neutralGreen-900">
        TOKEN SALES ENDS IN
      </span>
      <div className="flex justify-between self-stretch">
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.days}
          </span>
          <span className="text-center text-body2 text-neutralGreen-900">
            DAYS
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.hours}
          </span>
          <span className="text-center text-body2 text-neutralGreen-900">
            HRS
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.minutes}
          </span>
          <span className="text-center text-body2 text-neutralGreen-900">
            MIN
          </span>
        </div>
        <span className="text-heading3 text-neutralGreen-900">:</span>
        <div className="flex min-w-14 flex-col items-center justify-center">
          <span className="text-heading2 gradient-text">
            {timeRemaining.seconds}
          </span>
          <span className="text-center text-body2 text-neutralGreen-900">
            SEC
          </span>
        </div>
      </div>
    </div>
  );
};
