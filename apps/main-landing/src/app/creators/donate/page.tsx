'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@idriss-xyz/ui/button';
import {
  CREATORS_LINK,
  EMPTY_HEX,
  TipHistoryNode,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { default as io } from 'socket.io-client';
import _ from 'lodash';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import DonateHistoryList from '@/app/creators/donate/components/history/donate-history-list';
import { DonateContentValues } from '@/app/creators/donate/types';
import { useGetDonorHistory } from '@/app/creators/donate/commands/get-donor-history';

import { useCreators } from '../hooks/use-creators';
import DonorStatsList from '../donor/components/donor-stats-list';

import { TopDonors } from './top-donors';
import { Content } from './content';
import { RainbowKitProviders } from './providers';
import { CREATOR_API_URL } from './constants';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <RainbowKitProviders>
      <DonorsContent />
    </RainbowKitProviders>
  );
}

function DonorsContent() {
  const { searchParams } = useCreators();
  const [tipEdges, setTipEdges] = useState<{ node: TipHistoryNode }[]>([]);
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'user-tip',
  });
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const tips = useGetTipHistory(
    { address: searchParams.address.data! },
    { enabled: !!searchParams.address.data },
  );

  useEffect(() => {
    if (tips.data) {
      setTipEdges(tips.data.data);
    }
  }, [tips.data]);

  const donorHistory = useGetDonorHistory(
    { address: currentContent.userDetails?.address ?? EMPTY_HEX },
    { enabled: !!currentContent.userDetails?.address },
  );

  console.log(searchParams);

  const updateCurrentContent = useCallback((content: DonateContentValues) => {
    setCurrentContent((previous) => {
      return { previous, ...content };
    });
  }, []);

  const currentContentComponent = useMemo(() => {
    switch (currentContent?.name) {
      case 'user-tip': {
        return (
          <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
            <Content
              validatedAddress={searchParams.address.data}
              className="container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />

            <TopDonors
              tipEdges={tipEdges}
              heading="Top donors"
              tipsLoading={tips.isLoading}
              updateCurrentContent={updateCurrentContent}
              validatedAddress={searchParams.address.data}
              className="container mt-8 overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
          </div>
        );
      }
      case 'user-history': {
        return (
          <DonateHistoryList
            tipEdges={tipEdges}
            tipsLoading={tips.isLoading}
            currentContent={currentContent}
            address={searchParams.address.data}
            updateCurrentContent={updateCurrentContent}
            isInvalidAddress={searchParams.address.validationError}
          />
        );
      }
      default: {
        return;
      }
    }
  }, [
    currentContent,
    searchParams.address.data,
    searchParams.address.validationError,
    tipEdges,
    tips.isLoading,
    updateCurrentContent,
  ]);

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

        socket.on('newDonation', (node: TipHistoryNode) => {
          setTipEdges((previousState) => {
            return _.uniqBy([{ node }, ...previousState], (item) => {
              return _.get(item, 'node.transaction.hash');
            });
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
