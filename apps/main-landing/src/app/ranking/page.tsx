'use client';
import '@rainbow-me/rainbowkit/styles.css';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { backgroundLines2 } from '@/assets';
import { LeaderboardStandalone } from '@/app/donate/components/leaderboard';
import { RainbowKitProviders } from '@/app/donate/providers';

import { TopBar } from '../components/top-bar';

import { useGetCreatorRanking } from './commands/get-creator-ranking';

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
  const creatorRanking = useGetCreatorRanking();

  const onDonorClick = useCallback(
    (displayName: string) => {
      router.push(`/${displayName.toLowerCase()}`);
    },
    [router],
  );

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

        <div className="grid grid-cols-1 items-start gap-x-10">
          <LeaderboardStandalone
            heading="Top streamers"
            onDonorClick={onDonorClick}
            leaderboard={creatorRanking.data ?? []}
            leaderboardError={creatorRanking.isError}
            leaderboardLoading={creatorRanking.isLoading}
            className="container mt-8 w-[360px] max-w-full overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
          />
        </div>
      </main>
    </>
  );
}
