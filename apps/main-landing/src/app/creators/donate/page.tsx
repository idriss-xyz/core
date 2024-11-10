import Image from 'next/image';

import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';

import { Providers } from './providers';
import { Content } from './content';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <Providers>
      <TopBar />
      <main className="flex grow items-start justify-center overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] pt-[104px]">
        <Image
          priority
          src={backgroundLines2}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <Content className="container lg:mt-[108px]" />
      </main>
    </Providers>
  );
}
