/* eslint-disable @next/next/no-img-element */
'use client';
import { ANNOUNCEMENT_LINK } from '@idriss-xyz/constants';
import { Button } from '@idriss-xyz/ui/button';

import { backgroundLines2 } from '@/assets';

import { Providers } from './providers';
import { TopBar } from './landing/components/top-bar';
import { Creators } from './creators';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <Providers>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        <div className="mt-8 w-[440px] max-w-full overflow-hidden px-safe lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
          <Creators />
        </div>

        <Button
          asLink
          isExternal
          size="small"
          intent="secondary"
          prefixIconName="InfoCircle"
          href={ANNOUNCEMENT_LINK.CREATORS_DONATIONS}
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
        >
          STEP-BY-STEP GUIDE
        </Button>
      </main>
    </Providers>
  );
}
