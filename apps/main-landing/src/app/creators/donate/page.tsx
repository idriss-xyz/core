/* eslint-disable @next/next/no-img-element */
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_LINK } from '@idriss-xyz/constants';

import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';

import { RainbowKitProviders } from './providers';
import { Content } from './content';
import { TopDonors } from './top-donors';
import '@rainbow-me/rainbowkit/styles.css';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <RainbowKitProviders>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          <Content className="container mt-8 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]" />
          <TopDonors className="container mt-8 px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]" />
        </div>

        <Button
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
          intent="secondary"
          size="small"
          href={CREATORS_LINK}
          isExternal
          asLink
        >
          CREATE YOUR LINK
        </Button>
      </main>
    </RainbowKitProviders>
  );
}
