'use client';
import {
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
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';
import _ from 'lodash';

import { backgroundLines2 } from '@/assets';
import { useGetTipHistory } from '@/app/creators/app/commands/get-donate-history';
import { DonateHistory } from '@/app/creators/donate/components/donate-history';
import {
  CreatorProfile,
  DonateContentValues,
} from '@/app/creators/donate/types';

import { useCreators } from '../hooks/use-creators';
import { TopBar } from '../components/top-bar';

import { Leaderboard } from './components/leaderboard';
import { DonateForm } from './components/donate-form';

interface Properties {
  creatorProfile?: CreatorProfile;
}

export function DonateContent({ creatorProfile }: Properties) {
  const router = useRouter();
  const { searchParams } = useCreators();
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardStats[]>([]);
  const [currentContent, setCurrentContent] = useState<DonateContentValues>({
    name: 'user-tip',
  });
  const [creatorInfo, setCreatorInfo] = useState<CreatorProfile | null>(
    creatorProfile ?? null,
  );
  const formReference = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState(0);
  const [isLegacyLink, setIsLegacyLink] = useState(false);

  const {
    address: { data: addr, isValid: addrValid, isFetching: addrFetching },
    creatorName,
    network: networkParameter,
    token: tokenParameter,
  } = searchParams;

  useEffect(() => {
    if (creatorProfile) return;
    if (addrFetching) return;
    if (!addr || !addrValid) return;

    setCreatorInfo({
      address: { data: addr, isValid: addrValid, isFetching: addrFetching },
      name: creatorName ?? '',
      token: tokenParameter,
      network: networkParameter,
      minimumAlertAmount: DEFAULT_DONATION_MIN_ALERT_AMOUNT,
      minimumTTSAmount: DEFAULT_DONATION_MIN_TTS_AMOUNT,
      minimumSfxAmount: DEFAULT_DONATION_MIN_SFX_AMOUNT,
    });
    setIsLegacyLink(true);
  }, [
    addr,
    addrValid,
    addrFetching,
    creatorProfile,
    creatorName,
    networkParameter,
    tokenParameter,
  ]);

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

  useEffect(() => {
    const formElement = formReference.current;
    if (!formElement) return;

    const resizeObserver = new ResizeObserver(() => {
      if (formReference.current) {
        requestAnimationFrame(() => {
          if (formReference.current)
            setFormHeight(formReference.current.getBoundingClientRect().height);
        });
      }
    });

    resizeObserver.observe(formElement);

    return () => {
      return resizeObserver.disconnect();
    };
  }, [creatorInfo]);

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
                  ref={formReference}
                  className="container mt-8 overflow-hidden lg:mt-[90px] lg:[@media(max-height:800px)]:mt-[40px]"
                  creatorInfo={creatorInfo}
                  isLegacyLink={isLegacyLink}
                />

                <Leaderboard
                  isScrollable
                  leaderboard={leaderboard}
                  onDonorClick={onDonorClick}
                  address={creatorInfo.address}
                  updateCurrentContent={updateCurrentContent}
                  leaderboardError={donationsHistory.isError}
                  leaderboardLoading={donationsHistory.isLoading}
                  className="container mt-8 px-0 lg:mt-[90px] lg:[@media(max-height:800px)]:mt-[40px]"
                  style={{
                    height: formHeight > 0 ? `${formHeight}px` : undefined,
                  }}
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
    formHeight,
    donationsHistory.isError,
    donationsHistory.isLoading,
    isLegacyLink,
  ]);

  return (
    <>
      <TopBar />
      {/* Temproarily use a div instead of ScrollArea (not dispatching event) */}
      <div
        onScroll={(event) => {
          const scrollTop = (event.target as HTMLDivElement).scrollTop;
          window.dispatchEvent(
            new CustomEvent('creatorsLandingPageScroll', {
              detail: { scrollTop },
            }),
          );
        }}
        className="h-screen overflow-y-auto"
      >
        <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
          <link rel="preload" as="image" href={backgroundLines2.src} />
          <img
            alt=""
            src={backgroundLines2.src}
            className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
          />

          {currentContentComponent}
        </main>
      </div>
    </>
  );
}
