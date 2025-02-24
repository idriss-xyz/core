'use client';
import { Hex } from 'viem';
import '@rainbow-me/rainbowkit/styles.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { default as io } from 'socket.io-client';
import _ from 'lodash';

import { validateAddressOrENS } from '@/app/creators/donate/utils';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';

import { TopDonors } from '../donate/top-donors';
import { RainbowKitProviders } from '../donate/providers';
import { ZapperNode } from '../donate/types';

const SOCKET_URL = 'https://core-production-a116.up.railway.app';

// ts-unused-exports:disable-next-line
export default function Widget() {
  return (
    <RainbowKitProviders>
      <DonorsContent />
    </RainbowKitProviders>
  );
}

function DonorsContent() {
  const [tipEdges, setTipEdges] = useState<{ node: ZapperNode }[]>([]);
  const [validatedAddress, setValidatedAddress] = useState<
    string | null | undefined
  >();
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

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

  const tips = useGetTipHistory(
    { address: validatedAddress as Hex },
    { enabled: !!validatedAddress },
  );

  useEffect(() => {
    if (tips.data) {
      setTipEdges(tips.data.data);
    }
  }, [tips.data]);

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

        socket.on('newDonation', (node: ZapperNode) => {
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
  }, [socketConnected, socketInitialized, validatedAddress]);

  return (
    <TopDonors
      isStandalone
      tipEdges={tipEdges}
      tipsLoading={tips.isLoading}
      validatedAddress={validatedAddress}
      className="overflow-hidden px-0"
    />
  );
}
