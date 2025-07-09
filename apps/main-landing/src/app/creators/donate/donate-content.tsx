import { Button } from '@idriss-xyz/ui/button';
import {
  CREATORS_LINK,
  EMPTY_HEX,
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  CREATOR_API_URL,
  DonationData,
  LeaderboardStats,
} from '@idriss-xyz/constants';
import '@rainbow-me/rainbowkit/styles.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { default as io } from 'socket.io-client';
import { Hex, isAddress } from 'viem';
import { useRouter } from 'next/navigation';
import _ from 'lodash';

import { backgroundLines2 } from '@/assets';
import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { DonateHistory } from '@/app/creators/donate/components/donate-history';
import {
  CreatorProfile,
  DonateContentValues,
} from '@/app/creators/donate/types';

import { useCreators } from '../hooks/use-creators';
import { TopBar } from '../components/top-bar';
import { getCreatorProfile } from '../utils';

import { Leaderboard } from './components/leaderboard';
import { DonateForm } from './components/donate-form';

interface Properties {
  creatorName?: string;
}

export function DonateContent({ creatorName }: Properties) {
  const router = useRouter();
  const { searchParams } = useCreators();
  const creatorInfoSetReference = useRef(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'user-tip',
  });
  const [creatorInfo, setCreatorInfo] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getCreatorProfile(creatorName);

        if (!profile) {
          return;
        }

        setCreatorInfo({
          ...profile,
          address: {
            data: profile.primaryAddress,
            isValid: isAddress(profile.primaryAddress),
            isFetching: false,
          },
          network: profile.networks.join(','),
          token: profile.tokens.join(','),
        });
        creatorInfoSetReference.current = true;
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      }
    };

    if (creatorInfoSetReference.current) return;

    if (searchParams.address.data == null && creatorName) {
      void fetchProfile();
    } else if (!searchParams.address.isFetching) {
      setCreatorInfo({
        ...searchParams,
        name: searchParams.creatorName,
        minimumAlertAmount: DEFAULT_DONATION_MIN_ALERT_AMOUNT,
        minimumTTSAmount: DEFAULT_DONATION_MIN_TTS_AMOUNT,
        minimumSfxAmount: DEFAULT_DONATION_MIN_SFX_AMOUNT,
      });
      creatorInfoSetReference.current = true;
    }
  }, [searchParams, creatorName]);

  const donationsHistory = useGetTipHistory(
    { address: creatorInfo?.address.data ?? EMPTY_HEX },
    { enabled: creatorInfo?.address.isValid },
  );

  useEffect(() => {
    if (donationsHistory.data) {
      setDonations(donationsHistory.data.donations);
      setLeaderboard(donationsHistory.data.leaderboard);
    }
  }, [donationsHistory.data]);

  useEffect(() => {
    if (creatorInfo?.address.isValid) {
      void donationsHistory.refetch(); // refetch to get history after creatorInfo is done setting
    }
  }, [creatorInfo, donationsHistory]);

  useEffect(() => {
    if (creatorInfo?.address.data && !socketInitialized) {
      const socket = io(CREATOR_API_URL);
      setSocketInitialized(true);

      if (socket && !socketConnected) {
        socket.on('connect', () => {
          socket.emit('register', creatorInfo?.address.data);

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

            if (donorIndex === -1) {
              leaderboard.push({
                ...donation.fromUser,
                totalAmount: donation.tradeValue,
              });
            } else {
              const donor = leaderboard[donorIndex]!;
              leaderboard[donorIndex] = {
                ...donor,
                totalAmount: donor.totalAmount + donation.tradeValue,
              };
            }

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
  }, [socketConnected, socketInitialized, creatorInfo?.address.data]);

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
            {creatorInfo && (
              <>
                <DonateForm
                  className="container mt-8 overflow-hidden lg:mt-[90px] lg:[@media(max-height:800px)]:mt-[40px]"
                  creatorInfo={creatorInfo}
                />

                <Leaderboard
                  leaderboard={leaderboard}
                  onDonorClick={onDonorClick}
                  address={creatorInfo.address}
                  updateCurrentContent={updateCurrentContent}
                  leaderboardError={donationsHistory.isError}
                  leaderboardLoading={donationsHistory.isLoading}
                  className="container mt-8 overflow-hidden px-0 lg:mt-[90px] lg:[@media(max-height:800px)]:mt-[40px]"
                />
              </>
            )}
          </div>
        );
      }

      case 'user-history': {
        return (
          creatorInfo && (
            <DonateHistory
              donations={donations}
              address={creatorInfo?.address}
              currentContent={currentContent}
              donationsError={donationsHistory.isError}
              updateCurrentContent={updateCurrentContent}
              donationsLoading={donationsHistory.isLoading}
            />
          )
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
    creatorInfo,
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
