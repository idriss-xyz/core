'use client';
import { Hex } from 'viem';
import { useEffect, useState } from 'react';
import { default as io } from 'socket.io-client';
import _ from 'lodash';
import { useSearchParams } from 'next/navigation';
import { EMPTY_HEX, TipHistoryNode } from '@idriss-xyz/constants';

import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { FormValues, WidgetVariants } from '@/app/creators/widget/types';
import { Providers } from '@/app/creators/widget/providers';

import { TopDonors } from '../donate/top-donors';

import { CREATOR_API_URL } from './constants';

// ts-unused-exports:disable-next-line
export default function Widget() {
  return (
    <Providers>
      <WidgetContent />
    </Providers>
  );
}

function WidgetContent() {
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [tipEdges, setTipEdges] = useState<{ node: TipHistoryNode }[]>([]);
  const [address, setAddress] = useState<Hex | null | undefined>();

  const searchParameters = useSearchParams();
  const variant = searchParameters.get('variant');
  const widgetVariant: WidgetVariants = [
    null,
    'panel',
    'videoOverlay',
    'videoComponent',
  ].includes(variant)
    ? (variant as WidgetVariants)
    : null;
  const isVideoOverlay = widgetVariant === 'videoOverlay';

  useEffect(() => {
    if (!window.Twitch?.ext) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    window.Twitch.ext.onAuthorized(() => {
      const storedConfig = window.Twitch.ext.configuration.broadcaster?.content;

      if (storedConfig) {
        const parsedConfig: FormValues = JSON.parse(storedConfig);
        setAddress(parsedConfig.address as Hex);
      } else {
        setAddress(null);
      }
    });
  }, []);

  const tips = useGetTipHistory(
    { address: address ?? EMPTY_HEX },
    { enabled: !!address },
  );

  useEffect(() => {
    if (tips.data) {
      setTipEdges(tips.data.data);
    }
  }, [tips.data]);

  useEffect(() => {
    if (address && !socketInitialized) {
      const socket = io(CREATOR_API_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', address);

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
  }, [address, socketConnected, socketInitialized]);

  return (
    <>
      {isVideoOverlay ? (
        <div className="relative flex size-full items-start justify-end pr-28 pt-20">
          <TopDonors
            tipEdges={tipEdges}
            variant={widgetVariant}
            validatedAddress={address}
            tipsLoading={tips.isLoading}
            className="relative right-0 top-0 origin-top-right scale-[.85]"
          />
        </div>
      ) : (
        <TopDonors
          tipEdges={tipEdges}
          variant={widgetVariant}
          validatedAddress={address}
          tipsLoading={tips.isLoading}
        />
      )}

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" />
    </>
  );
}
