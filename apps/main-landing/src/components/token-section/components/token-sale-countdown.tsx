'use client';

import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { LabeledGradientProperty } from './labeled-gradient-property';

// ts-unused-exports:disable-next-line
export const TokenSaleCountdown = () => {
  return (
    <div className="relative flex w-full flex-col items-center gap-5 rounded-2xl bg-white/20 px-4 py-6 md:px-10 md:py-8">
      <GradientBorder
        borderRadius={16}
        borderWidth={1}
        gradientDirection="toTop"
        gradientStartColor="#5FEB3C"
        gradientStopColor="rgba(255,255,255,1)"
      />
      <div className="flex justify-center self-stretch">
        <LabeledGradientProperty label="" content="SOLD OUT" />
      </div>
    </div>
  );
};
