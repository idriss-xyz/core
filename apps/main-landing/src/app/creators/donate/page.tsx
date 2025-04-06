'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_LINK, EMPTY_HEX } from '@idriss-xyz/constants';
import '@rainbow-me/rainbowkit/styles.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { default as io } from 'socket.io-client';
import _ from 'lodash';
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { DonateHistory } from '@/app/creators/donate/components/donate-history';
import {
  DonateContentValues,
  DonationData,
  LeaderboardStats,
} from '@/app/creators/donate/types';

import { useCreators } from '../hooks/use-creators';

import { Leaderboard } from './components/leaderboard';
import { DonateForm } from './components/donate-form';
import { RainbowKitProviders } from './providers';
import { CREATOR_API_URL } from './constants';

// ts-unused-exports:disable-next-line
export default function Donate() {
  return (
    <RainbowKitProviders>
      <DonateContent />
    </RainbowKitProviders>
  );
}

function DonateContent() {
  const router = useRouter();
  const { searchParams } = useCreators();
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'user-tip',
  });

  const donationsHistory = useGetTipHistory(
    { address: searchParams.address.data ?? EMPTY_HEX },
    { enabled: searchParams.address.isValid },
  );

  useEffect(() => {
    if (donationsHistory.data) {
      setDonations(donationsHistory.data.donations);
      setLeaderboard(donationsHistory.data.leaderboard);
    }
  }, [donationsHistory.data]);

  useEffect(() => {
    if (searchParams.address.data && !socketInitialized) {
      const socket = io(CREATOR_API_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', searchParams.address.data);

          if (socket.connected) {
            setSocketConnected(true);
          }
        });

        socket.on('newDonation', (donation: DonationData) => {
          setDonations((previousState) => {
            return _.uniqBy([donation, ...previousState], (item) => {
              return _.get(item, 'transactionHash');
            });
          });

          setLeaderboard((previousState) => {
            const leaderboard = [...previousState];

            const donorIndex = leaderboard.findIndex((item) => {
              return (
                item.address.toLowerCase() ===
                donation.fromAddress.toLowerCase()
              );
            });

            const donor = leaderboard[donorIndex];

            if (donor) {
              leaderboard[donorIndex] = {
                ...donor,
                totalAmount: donor.totalAmount + donation.tradeValue,
              };
            }

            leaderboard.push({
              ...donation.fromUser,
              totalAmount: donation.tradeValue,
            });

            leaderboard.sort((a, b) => {
              return b.totalAmount - a.totalAmount;
            });

            return leaderboard;
          });
        });
      }

      return () => {
        if (socket.connected) {
          socket.disconnect();
          setSocketConnected(false);
        }
      };
    }

    return;
  }, [socketConnected, socketInitialized, searchParams.address.data]);

  const updateCurrentContent = useCallback((content: DonateContentValues) => {
    setCurrentContent((previous) => {
      return { previous, ...content };
    });
  }, []);

  const onDonorClick = useCallback(
    (address: Hex) => {
      router.push(`/creators/donor/${address}`);
    },
    [router],
  );

  const currentContentComponent = useMemo(() => {
    switch (currentContent?.name) {
      case 'user-tip': {
        return (
          <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
            <DonateForm className="container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]" />

            <Leaderboard
              leaderboard={leaderboard}
              onDonorClick={onDonorClick}
              address={searchParams.address}
              updateCurrentContent={updateCurrentContent}
              leaderboardError={donationsHistory.isError}
              leaderboardLoading={donationsHistory.isLoading}
              className="container mt-8 overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
          </div>
        );
      }

      case 'user-history': {
        return (
          <DonateHistory
            donations={donations}
            address={searchParams.address}
            currentContent={currentContent}
            donationsError={donationsHistory.isError}
            updateCurrentContent={updateCurrentContent}
            donationsLoading={donationsHistory.isLoading}
          />
        );
      }

      default: {
        return;
      }
    }
  }, [
    donations,
    leaderboard,
    onDonorClick,
    currentContent,
    searchParams.address,
    updateCurrentContent,
    donationsHistory.isError,
    donationsHistory.isLoading,
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

        <Button
          asLink
          isExternal
          size="small"
          intent="secondary"
          href={CREATORS_LINK}
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
        >
          CREATE YOUR LINK
        </Button>
      </main>
    </>
  );
}
