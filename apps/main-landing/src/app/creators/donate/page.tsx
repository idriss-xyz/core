import Image from 'next/image';
import { Button } from '@idriss-xyz/ui/button';
import { ANNOUNCEMENT_LINK } from '@idriss-xyz/constants';

import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';

import { Providers } from './providers';
import { Content } from './content';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <Providers>
      <TopBar />
      <main className="flex grow items-start justify-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pt-[56px] lg:px-0">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <Content className="container mt-10 lg:mt-[108px]" />
        <Button
          className="absolute bottom-6 right-1/2 translate-x-1/2 px-5 py-3.5 lg:right-7 lg:translate-x-0"
          intent="secondary"
          size="small"
          href={ANNOUNCEMENT_LINK.CREATORS_DONATIONS}
          isExternal
          asLink
        >
          CREATE YOUR LINK
        </Button>
      </main>
    </Providers>
  );
}
