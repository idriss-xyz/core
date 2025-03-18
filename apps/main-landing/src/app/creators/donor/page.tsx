/* eslint-disable @next/next/no-img-element */
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { RainbowKitProviders } from '@/app/creators/donate/providers';
import UserHistoryList from '@/app/creators/donate/components/user-history/user-history-list';
import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';

const SEARCH_PARAMETER = {
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
};

// ts-unused-exports:disable-next-line
export default function Donor() {
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();

  const searchParameters = useSearchParams();
  const addressFromParameters =
    searchParameters.get(SEARCH_PARAMETER.ADDRESS) ??
    searchParameters.get(SEARCH_PARAMETER.LEGACY_ADDRESS);

  useEffect(() => {
    const validateAddress = async () => {
      const address = await validateAddressOrENS(addressFromParameters);
      setValidatedAddress(address);
    };
    void validateAddress();
  }, [addressFromParameters]);

  return (
    <>
      <TopBar />
      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
          alt=""
        />

        <RainbowKitProviders>
          <UserHistoryList
            isStandalone={true}
            validatedAddress={validatedAddress}
          />
        </RainbowKitProviders>
      </main>
    </>
  );
}
