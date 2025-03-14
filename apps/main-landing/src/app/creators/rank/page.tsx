'use client';
/* eslint-disable @next/next/no-img-element */
import { hexSchema, TipHistoryNode } from '@idriss-xyz/constants';
import { isAddress } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { default as io } from 'socket.io-client';
import _ from 'lodash';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import { validateAddressOrENS } from '@/app/creators/donate/utils';
import DonateHistoryList from '@/app/creators/donate/components/history/donate-history-list';
import { useGetReceivedHistory } from '@/app/creators/donate/commands/get-received-history';

import { DonateRanking } from '../donate/donate-ranking';
import { RainbowKitProviders } from '../donate/providers';

const SOCKET_URL = 'https://core-production-a116.up.railway.app';

const SEARCH_PARAMETER = {
  ADDRESS: 'address',
  LEGACY_ADDRESS: 'streamerAddress',
};

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

  const receivedTips = useGetReceivedHistory();

  useEffect(() => {
    if (receivedTips.data) {
      setReceivedTipEdges(receivedTips.data.data);
    }
  }, [receivedTips.data]);

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
            <DonateRanking
              heading="Top streamers"
              tipEdges={receivedTipEdges}
              historyTabName="received-history"
              validatedAddress={validatedAddress}
              tipsLoading={receivedTips.isLoading}
              updateCurrentContent={updateCurrentContent}
              className="container mt-8 overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
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
  }, [
    currentContent,
    isInvalidAddress,
    receivedTipEdges,
    receivedTips.isLoading,
    validatedAddress,
  ]);

  useEffect(() => {
    if (validatedAddress && !socketInitialized) {
      const socket = io(SOCKET_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', validatedAddress);

          if (socket.connected) {
            setSocketConnected(true);
          }
        });

        socket.on('newDonation', (node: TipHistoryNode) => {
          setReceivedTipEdges((previousState) => {
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
      </main>
    </>
  );
}
