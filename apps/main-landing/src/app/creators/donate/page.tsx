'use client';
/* eslint-disable @next/next/no-img-element */
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_LINK, hexSchema } from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import io from 'socket.io-client';

import { backgroundLines2 } from '@/assets';
import { TopBar } from '@/components';
import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import DonateHistoryList from '@/app/creators/donate/components/history/donate-history-list';

import { TopDonors } from './top-donors';
import { Content } from './content';
import { RainbowKitProviders } from './providers';

// ts-unused-exports:disable-next-line
export default function Donors() {
  return (
    <RainbowKitProviders>
      <DonorsContent />
    </RainbowKitProviders>
  );
}

function DonorsContent() {
  const [currentContent, setCurrentContent] = useState<'tip' | 'history'>(
    'tip',
  );
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();

  const searchParameters = useSearchParams();
  const addressFromParameters =
    searchParameters.get('address') ?? searchParameters.get('streamerAddress');

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

  const tipEdges = useMemo(() => {
    return tips.data?.data ?? [];
  }, [tips.data?.data]);

  const updateCurrentContent = (content: 'tip' | 'history') => {
    setCurrentContent(content);
  };

  const currentContentComponent = useMemo(() => {
    switch (currentContent) {
      case 'tip': {
        return (
          <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-2">
            <Content
              validatedAddress={validatedAddress}
              className="container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
            <TopDonors
              tipEdges={tipEdges}
              tipsLoading={tips.isLoading}
              validatedAddress={validatedAddress}
              updateCurrentContent={updateCurrentContent}
              className="container mt-8 overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
            />
          </div>
        );
      }
      case 'history': {
        return (
          <DonateHistoryList
            tipEdges={tipEdges}
            address={validatedAddress}
            tipsLoading={tips.isLoading}
            isInvalidAddress={isInvalidAddress}
            updateCurrentContent={updateCurrentContent}
          />
        );
      }
    }
  }, [
    currentContent,
    isInvalidAddress,
    tipEdges,
    tips.isLoading,
    validatedAddress,
  ]);

  const SOCKET_URL = 'http://localhost:4000';

  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Connect to the socket server.
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Subscribe using your address.
      socket.emit('register', validatedAddress);
    });

    // Listen for new donation events.
    socket.on('newDonation', (donation) => {
      console.log('New donation received:', donation);
      setDonations((previous) => {
        return [...previous, donation];
      });
    });

    // Cleanup on unmount.
    return () => {
      socket.disconnect();
      console.log('Socket disconnected:', socket.id);
    };
  }, [validatedAddress]);

  console.log(donations);

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
