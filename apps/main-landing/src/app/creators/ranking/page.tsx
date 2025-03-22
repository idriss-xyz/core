'use client';
/* eslint-disable @next/next/no-img-element */
import '@rainbow-me/rainbowkit/styles.css';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import { useGetStreamerRanking } from '@/app/creators/donate/commands/get-streamer-ranking';
import { LeaderboardTopDonors } from '@/app/creators/donate/top-donors';
import { DonateContentValues } from '@/app/creators/donate/types';

import { RainbowKitProviders } from '../donate/providers';

// ts-unused-exports:disable-next-line
export default function Ranking() {
  return (
    <RainbowKitProviders>
      <RankingContent />
    </RainbowKitProviders>
  );
}

function RankingContent() {
  const router = useRouter();
  const streamerRanking = useGetStreamerRanking();

  const updateCurrentContent = useCallback(
    (content: DonateContentValues) => {
      const userAddress = content.userDetails?.address?.toLowerCase();

      if (!userAddress) {
        return;
      }

      const donateLink = streamerRanking.data?.find((stats) => {
        return stats.address.toLowerCase() === userAddress.toLowerCase();
      })?.donateLink;

      if (donateLink) {
        const url = new URL(donateLink);
        const parameters = new URLSearchParams(url.search);

        router.push(`/creators/donate?${parameters.toString()}`);
      } else {
        router.push(`/creators/donate?address=${userAddress}`);
      }
    },
    [router, streamerRanking.data],
  );

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

        <div className="grid grid-cols-1 items-start gap-x-10">
          <LeaderboardTopDonors
            heading="Top creators"
            leaderboard={streamerRanking.data ?? []}
            leaderboardError={streamerRanking.isError}
            updateCurrentContent={updateCurrentContent}
            leaderboardLoading={streamerRanking.isLoading}
            className="container mt-8 w-[360px] max-w-full overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
          />
        </div>
      </main>
    </>
  );
}
