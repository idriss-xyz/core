/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useMemo, useState } from 'react';
import { EMPTY_HEX } from '@idriss-xyz/constants';

import { RainbowKitProviders } from '@/app/creators/donate/providers';
import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';
import { DonateContentValues } from '@/app/creators/donate/types';
import { useGetDonorHistory } from '@/app/creators/donor/commands/get-donor-history';
import { DonateHistory } from '@/app/creators/donate/components/donate-history';

import DonorStatsList from '../components/donor-stats-list';
import { useCreators } from '../../hooks/use-creators';

// ts-unused-exports:disable-next-line
export default function Donor() {
  return (
    <RainbowKitProviders>
      <DonorContent />
    </RainbowKitProviders>
  );
}

function DonorContent() {
  const { urlParams } = useCreators();
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'donor-stats',
  });

  const donorHistory = useGetDonorHistory(
    { address: urlParams.address.data ?? EMPTY_HEX },
    { enabled: urlParams.address.isValid },
  );

  const donorStats = donorHistory.data?.stats;
  const donorDonations = donorHistory.data?.donations;

  const updateCurrentContent = useCallback((content: DonateContentValues) => {
    setCurrentContent((previous) => {
      return { previous, ...content };
    });
  }, []);

  const currentContentComponent = useMemo(() => {
    switch (currentContent?.name) {
      case 'donor-stats': {
        return (
          <DonorStatsList
            stats={donorStats}
            address={urlParams.address}
            statsError={donorHistory.isError}
            statsLoading={donorHistory.isLoading}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }

      case 'donor-history': {
        return (
          <DonateHistory
            showReceiver
            address={urlParams.address}
            currentContent={currentContent}
            donations={donorDonations ?? []}
            donationsError={donorHistory.isError}
            donationsLoading={donorHistory.isLoading}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }

      default: {
        return;
      }
    }
  }, [
    donorStats,
    donorDonations,
    currentContent,
    urlParams.address,
    donorHistory.isError,
    updateCurrentContent,
    donorHistory.isLoading,
  ]);

  return (
    <>
      <TopBar />

      <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
        <link rel="preload" as="image" href={backgroundLines2.src} />
        <img
          alt=""
          src={backgroundLines2.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        />

        {currentContentComponent}
      </main>
    </>
  );
}
