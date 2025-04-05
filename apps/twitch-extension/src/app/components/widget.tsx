'use client';
import { Hex } from 'viem';
import { useEffect, useState } from 'react';
import { default as io } from 'socket.io-client';
import _ from 'lodash';
import { EMPTY_HEX } from '@idriss-xyz/constants';
import { useGetTipHistory } from '@idriss-xyz/main-landing/app/creators/donate/commands/get-donate-history';
import { TopDonors } from '@idriss-xyz/main-landing/app/creators/donate/top-donors';
import { QueryProvider } from '@idriss-xyz/main-landing/providers';
import {
  DonationData,
  LeaderboardStats,
} from '@idriss-xyz/main-landing/app/creators/donate/types';

import { CREATOR_API_URL } from '@/app/constants';
import { ConfigValues, WidgetVariants } from '@/app/types';

type Properties = {
  variant: WidgetVariants;
};

export function Widget({ variant }: Properties) {
  return (
    <QueryProvider>
      <WidgetContent variant={variant} />
    </QueryProvider>
  );
}

type ContentProperties = {
  variant: WidgetVariants;
};

function WidgetContent({ variant }: ContentProperties) {
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [tipLeaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [address, setAddress] = useState<Hex | null | undefined>();
  const [donationUrl, setDonationUrl] = useState<string | null | undefined>();

  const isVideoOverlay = variant === 'videoOverlay';

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const twitch = (window as any).Twitch;

    if (!twitch?.ext) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    twitch.ext.onAuthorized(() => {
      const storedConfig = twitch.ext.configuration.broadcaster?.content;

      if (storedConfig) {
        const parsedConfig: ConfigValues = JSON.parse(storedConfig);
        setAddress(parsedConfig.address as Hex);
        setDonationUrl(parsedConfig.donationLink);
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
      setLeaderboard(tips.data.leaderboard);
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
        socket.on('newDonation', (donation: DonationData) => {
          setLeaderboard((previousLeaderboard) => {
            const updatedLeaderboard = [...previousLeaderboard];
            const donorIndex = updatedLeaderboard.findIndex((item) => {
              return (
                item.address.toLowerCase() ===
                donation.fromAddress.toLowerCase()
              );
            });
            const donorEntry = updatedLeaderboard[donorIndex];
            if (donorEntry) {
              updatedLeaderboard[donorIndex] = {
                ...donorEntry,
                totalAmount: donorEntry.totalAmount + donation.tradeValue,
              };
            }
            updatedLeaderboard.sort((a, b) => {
              return b.totalAmount - a.totalAmount;
            });
            return updatedLeaderboard;
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
            variant={variant}
            leaderboard={tipLeaderboard}
            donationUrl={donationUrl}
            validatedAddress={address}
            tipsLoading={tips.isLoading}
            className="relative right-0 top-0 origin-top-right scale-[.85]"
          />
        </div>
      ) : (
        <TopDonors
          variant={variant}
          leaderboard={tipLeaderboard}
          donationUrl={donationUrl}
          validatedAddress={address}
          tipsLoading={tips.isLoading}
        />
      )}

      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js" />
    </>
  );
}
