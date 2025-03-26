/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EMPTY_HEX, hexSchema } from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';

import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { RainbowKitProviders } from '@/app/creators/donate/providers';
import { backgroundLines2 } from '@/assets';
import { DonateContentValues } from '@/app/creators/donate/types';
import { useGetDonorHistory } from '@/app/creators/donate/commands/get-donor-history';

import DonateHistoryList from '../donate/components/history/donate-history-list';
import DonorStatsList from '../donate/components/donor-stats/donor-stats-list';
import { TopBar } from '../landing/components/top-bar';

const SEARCH_PARAMETER = {
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
};

// ts-unused-exports:disable-next-line
export default function Donor() {
  return (
    <RainbowKitProviders>
      <DonorContent />
    </RainbowKitProviders>
  );
}

function DonorContent() {
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'donor-stats',
  });
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();
  const router = useRouter();

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

  const addressValidationResult = hexSchema.safeParse(validatedAddress);

  const userAddress = addressValidationResult
    ? (validatedAddress as Hex)
    : null;

  const donorHistory = useGetDonorHistory(
    { address: userAddress ?? EMPTY_HEX },
    { enabled: !!userAddress },
  );

  const updateCurrentContent = useCallback(
    (content: DonateContentValues) => {
      const userAddress = content.userDetails?.address;

      if (userAddress) {
        router.push(`?${SEARCH_PARAMETER.ADDRESS}=${userAddress}`);
      }

      setCurrentContent((previous) => {
        return { previous, ...content };
      });
    },
    [router, setCurrentContent],
  );

  const isInvalidAddress =
    !addressFromParameters ||
    (!!addressFromParameters && validatedAddress === null) ||
    (!!addressFromParameters &&
      !!validatedAddress &&
      (!addressValidationResult.success || !isAddress(validatedAddress)));

  const currentContentComponent = useMemo(() => {
    switch (currentContent?.name) {
      case 'donor-stats': {
        return (
          <DonorStatsList
            isStandalone
            currentContent={currentContent}
            isInvalidAddress={isInvalidAddress}
            validatedAddress={validatedAddress}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }
      case 'donor-history': {
        return (
          <DonateHistoryList
            tipEdges={
              donorHistory.data?.knownDonations.map((donation) => {
                return { node: donation.data };
              }) ?? []
            }
            showReceiver
            address={validatedAddress}
            currentContent={currentContent}
            isInvalidAddress={isInvalidAddress}
            tipsLoading={donorHistory.isLoading}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }
      default: {
        return;
      }
    }
  }, [
    currentContent,
    donorHistory.data?.knownDonations,
    donorHistory.isLoading,
    isInvalidAddress,
    updateCurrentContent,
    validatedAddress,
  ]);

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

        {currentContentComponent}
      </main>
    </>
  );
}
