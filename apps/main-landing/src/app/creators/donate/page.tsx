'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_LINK, hexSchema } from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { default as io } from 'socket.io-client';
import _ from 'lodash';

import { backgroundLines2 } from '@/assets';
import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import DonateHistoryList from '@/app/creators/donate/components/history/donate-history-list';
import {
  DonateContentValues,
  DonationData,
  LeaderboardStats,
} from '@/app/creators/donate/types';

import { TopBar } from '../landing/components/top-bar';

import { TopDonors } from './top-donors';
import { Content } from './content';
import { RainbowKitProviders } from './providers';
import { CREATOR_API_URL } from './constants';

const SEARCH_PARAMETER = {
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
};

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <RainbowKitProviders>
      <DonorsContent />
    </RainbowKitProviders>
  );
}

function DonorsContent() {
  const router = useRouter();
  const [tipEdges, setTipEdges] = useState<DonationData[]>([]);
  const [tipLeaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'user-tip',
  });
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

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

  const isInvalidAddress =
    !addressFromParameters ||
    (!!addressFromParameters && validatedAddress === null) ||
    (!!addressFromParameters &&
      !!validatedAddress &&
      (!addressValidationResult.success || !isAddress(validatedAddress)));

  const tips = useGetTipHistory(
    { address: validatedAddress as Hex },
    { enabled: !!validatedAddress },
  );

  useEffect(() => {
    if (tips.data) {
      setTipEdges(tips.data.donations);
      setLeaderboard(tips.data.leaderboard);
    }
  }, [tips.data]);

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
            <Content
              validatedAddress={validatedAddress}
              className="container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />

            <TopDonors
              leaderboard={tipLeaderboard}
              heading="Top donors"
              onDonorClick={onDonorClick}
              tipsLoading={tips.isLoading}
              validatedAddress={validatedAddress}
              updateCurrentContent={updateCurrentContent}
              className="container mt-8 overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
          </div>
        );
      }
      case 'user-history': {
        return (
          <DonateHistoryList
            donations={tipEdges}
            address={validatedAddress}
            tipsLoading={tips.isLoading}
            currentContent={currentContent}
            isInvalidAddress={isInvalidAddress}
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
    isInvalidAddress,
    onDonorClick,
    tipEdges,
    tipLeaderboard,
    tips.isLoading,
    updateCurrentContent,
    validatedAddress,
  ]);

  useEffect(() => {
    if (validatedAddress && !socketInitialized) {
      const socket = io(CREATOR_API_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', validatedAddress);

          if (socket.connected) {
            setSocketConnected(true);
          }
        });
        socket.on('newDonation', (donation: DonationData) => {
          setTipEdges((previousState) => {
            return _.uniqBy([donation, ...previousState], 'transactionHash');
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
  }, [socketConnected, socketInitialized, validatedAddress]);

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

        <Button
          className="px-5 py-3.5 lg:absolute lg:bottom-6 lg:right-7 lg:translate-x-0"
          intent="secondary"
          size="small"
          href={CREATORS_LINK}
          isExternal
          asLink
        >
          CREATE YOUR LINK
        </Button>
      </main>
    </>
  );
}
