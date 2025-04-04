/* eslint-disable @next/next/no-img-element */
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { EMPTY_HEX } from '@idriss-xyz/constants';

import { RainbowKitProviders } from '@/app/creators/donate/providers';
import { TopBar } from '@/components';
import { backgroundLines2 } from '@/assets';
import { DonateContentValues } from '@/app/creators/donate/types';
import { useGetDonorHistory } from '@/app/creators/donate/commands/get-donor-history';

import DonateHistoryList from '../../donate/components/history/donate-history-list';
import DonorStatsList from '../../donate/components/donor-stats/donor-stats-list';
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
  const router = useRouter();
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'donor-stats',
  });

  const donorHistory = useGetDonorHistory(
    { address: urlParams.address.data ?? EMPTY_HEX },
    { enabled: !!urlParams.address.data },
  );

  const updateCurrentContent = useCallback(
    (content: DonateContentValues) => {
      const userAddress = content.userDetails?.address;

      if (userAddress) {
        router.push(`/creators/donor/${userAddress}`);
      }

      setCurrentContent((previous) => {
        return { previous, ...content };
      });
    },
    [router],
  );

  const currentContentComponent = useMemo(() => {
    switch (currentContent?.name) {
      case 'donor-stats': {
        return (
          <DonorStatsList
            isStandalone
            address={urlParams.address}
            currentContent={currentContent}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }

      case 'donor-history': {
        return (
          <DonateHistoryList
            showReceiver
            address={urlParams.address}
            currentContent={currentContent}
            tipsLoading={donorHistory.isLoading}
            updateCurrentContent={updateCurrentContent}
            tipEdges={
              donorHistory.data?.knownDonations.map((donation) => {
                return { node: donation.data };
              }) ?? []
            }
          />
        );
      }

      default: {
        return;
      }
    }
  }, [
    currentContent,
    urlParams.address,
    updateCurrentContent,
    donorHistory.data?.knownDonations,
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
