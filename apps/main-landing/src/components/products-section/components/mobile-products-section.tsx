'use client';

import { classes } from '@idriss-xyz/ui/utils';

import { CreatorsSection } from './creators-section';

type Properties = {
  className?: string;
};

export const MobileProductsSection = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'relative pt-10 text-label5 lg:flex lg:w-fit lg:-translate-x-4 lg:rounded-[50px] lg:p-1 lg:text-label4 lg:[position:unset]',
        'bg-[linear-gradient(0deg,transparent,rgb(21,43,30)_20%,rgb(21,43,30)_80%)] lg:bg-[#022218]',
      )}
    >
      {/* -mt-5 was added to compensate the Tabs height */}
      <section className={className} id="streamers">
        <CreatorsSection fadeOut={false} />
      </section>
    </div>
  );
};
