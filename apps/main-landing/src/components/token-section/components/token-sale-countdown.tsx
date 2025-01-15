'use client';

import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { LabeledGradientProperty } from './labeled-gradient-property';

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
