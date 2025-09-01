'use client';
import { Hex, isAddress } from 'viem';
import { useEffect, useState } from 'react';
import { default as io } from 'socket.io-client';
import {
  EMPTY_HEX,
  hexSchema,
  CREATOR_API_URL,
  LeaderboardStats,
  DonationData,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import { useGetTipHistory } from '@idriss-xyz/main-landing/app/creators/app/commands/get-donate-history';
import { getPublicCreatorProfile } from '@idriss-xyz/main-landing/app/creators/utils/index';
import { Leaderboard } from '@idriss-xyz/main-landing/app/creators/donate/components/leaderboard';
import { QueryProvider } from '@idriss-xyz/main-landing/providers';
import { calculateDonationLeaderboard } from '@idriss-xyz/utils';

import { WidgetVariants } from '@/app/types';

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [address, setAddress] = useState<Hex | null | undefined>();

  const addressValidationResult = hexSchema.safeParse(address);

  const isAddressValid =
    !!address && isAddress(address) && addressValidationResult.success;

  const addressDetails = {
    data: address ?? null,
    isValid: isAddressValid,
    isFetching: address === undefined,
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const twitch = (window as any).Twitch;

    if (!twitch?.ext) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    twitch.ext.onAuthorized(
      async (auth: {
        clientId: string;
        helixToken: string;
        userId: string;
        channelId: string;
      }) => {
        const response = await fetch(
          `https://api.twitch.tv/helix/users?id=${auth.channelId}`,
          {
            headers: {
              'Client-ID': '0rvai4arse2wu9ucj2omj2zvajdc3m',
              'Authorization': `Extension ${auth.helixToken}`,
            },
          },
        );
        const data = await response.json();
        const name = data.data?.[0]?.login;

        if (!name) {
          setAddress(null);
          return;
        }

        const profileResponse = await getPublicCreatorProfile(name);
        if (!profileResponse) {
          setAddress(NULL_ADDRESS);
          console.info('No creator account found, setting default');
          return;
        }
        setAddress(profileResponse.primaryAddress);
      },
    );
  }, []);

  const donationsHistory = useGetTipHistory(
    { address: address ?? EMPTY_HEX },
    { enabled: !!address },
  );

  useEffect(() => {
    if (donationsHistory.data) {

      const allTimeLeaderboard = calculateDonationLeaderboard(
        donationsHistory.data.donations,
      );
      setLeaderboard(allTimeLeaderboard);
    }
  }, [donationsHistory.data]);

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
  }, [socketConnected, socketInitialized, address]);

  return variant === 'videoOverlay' ? (
    <div className="relative flex size-full items-start justify-end pr-28 pt-20">
      <Leaderboard
        variant={variant}
        address={addressDetails}
        leaderboard={leaderboard}
        leaderboardError={donationsHistory.isError}
        leaderboardLoading={donationsHistory.isLoading}
        className="relative right-0 top-0 origin-top-right scale-[.85]"
      />
    </div>
  ) : (
    <Leaderboard
      variant={variant}
      address={addressDetails}
      leaderboard={leaderboard}
      leaderboardError={donationsHistory.isError}
      leaderboardLoading={donationsHistory.isLoading}
    />
  );
}
