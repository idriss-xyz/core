'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { isAddress } from 'viem';

import { TopBar } from '@/components';
import { Providers } from '@/app/creators/providers';
import { backgroundLines2 } from '@/assets';

import DonateHistoryList from './components/donate-history-list';

// ts-unused-exports:disable-next-line
export default function DonateHistory() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const address = searchParameters.get('address');

  if (!address || !isAddress(address)) {
    router.push('/creators');
    return;
  }

  return (
    <Providers>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
          alt=""
        />

        <DonateHistoryList address={address} />
      </main>
    </Providers>
  );
}
