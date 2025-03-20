'use client';
/* eslint-disable @next/next/no-img-element */
import { TipHistoryNode } from '@idriss-xyz/constants';
import '@rainbow-me/rainbowkit/styles.css';
import { useMemo, useState } from 'react';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import DonateHistoryList from '@/app/creators/donate/components/history/donate-history-list';
import { useGetReceivedHistory } from '@/app/creators/donate/commands/get-received-history';
import { LeaderboardTopDonors } from '@/app/creators/donate/top-donors';

import { RainbowKitProviders } from '../donate/providers';

// ts-unused-exports:disable-next-line
export default function Rank() {
  return (
    <RainbowKitProviders>
      <RankContent />
    </RainbowKitProviders>
  );
}

function RankContent() {
  const [receivedTipEdges, setReceivedTipEdges] = useState<
    { node: TipHistoryNode }[]
  >([]);
  const [currentContent, setCurrentContent] = useState<
    'tip' | 'history' | 'received-history'
  >('tip');

  const receivedTips = useGetReceivedHistory();

  const updateCurrentContent = (
    content: 'tip' | 'history' | 'received-history',
  ) => {
    setCurrentContent(content);
  };

  const currentContentComponent = useMemo(() => {
    switch (currentContent) {
      case 'tip': {
        return (
          <div className="grid grid-cols-1 items-start gap-x-10">
            <LeaderboardTopDonors
              leaderboard={receivedTips.data ?? []}
              leaderboardError={receivedTips.isError}
              leaderboardLoading={receivedTips.isLoading}
              updateCurrentContent={updateCurrentContent}
              className="container mt-8 w-[360px] max-w-full overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
          </div>
        );
      }
      case 'history': {
        return <></>;
      }
      case 'received-history': {
        return (
          <DonateHistoryList
            address={validatedAddress}
            tipEdges={receivedTipEdges}
            isInvalidAddress={isInvalidAddress}
            tipsLoading={receivedTips.isLoading}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }
    }
  }, [currentContent, receivedTipEdges, receivedTips.isLoading]);

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
