'use client';

import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAddress } from 'viem';
import {
  CREATOR_API_URL,
  MAIN_LANDING_LINK,
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  StoredDonationData,
} from '@idriss-xyz/constants';
import { FullscreenOverlay } from '@idriss-xyz/ui/fullscreen-overlay';
import { ExternalLink } from '@idriss-xyz/ui/external-link';
import { classes } from '@idriss-xyz/ui/utils';

import { useCreators } from '../hooks/use-creators';
import { getPublicCreatorProfileBySlug } from '../utils';
import { Address } from '../donate/types';

import DonationNotification from './components/donation-notification';
import { fetchDonationSfxText } from './utils';
import { containsBadWords } from './utils/bad-words';
import { DonationNotificationProperties, MinimumAmounts } from './types';

const DONATION_MIN_OVERALL_VISIBLE_DURATION = 11_000;

interface Properties {
  creatorName?: string;
}

type QueuedDonation = Omit<
  DonationNotificationProperties,
  'minOverallVisibleDuration' | 'onFullyComplete'
>;

// ts-unused-exports:disable-next-line
export default function DonationOverlay({ creatorName }: Properties) {
  const {
    searchParams: { address: addressParameter },
  } = useCreators();

  const router = useRouter();
  const [name, setName] = useState<string | undefined>(creatorName);
  const [address, setAddress] = useState<Address | null>(null);
  const [minimumAmounts, setMinimumAmounts] = useState<MinimumAmounts>({
    minimumAlertAmount: DEFAULT_DONATION_MIN_ALERT_AMOUNT,
    minimumSfxAmount: DEFAULT_DONATION_MIN_SFX_AMOUNT,
    minimumTTSAmount: DEFAULT_DONATION_MIN_TTS_AMOUNT,
  });
  const [enableToggles, setEnableToggles] = useState({
    alertEnabled: false,
    ttsEnabled: false,
    sfxEnabled: false,
  });
  const [customBadWords, setCustomBadWords] = useState<string[]>([]);
  const [alertSound, setAlertSound] = useState<string>();
  const [voiceId, setVoiceId] = useState<string>();
  const [isDisplayingDonation, setIsDisplayingDonation] = useState(false);
  const [donationsQueue, setDonationsQueue] = useState<QueuedDonation[]>([]);

  /* legacy overlay = raw address param, no creator slug */
  const isLegacyLink =
    !creatorName &&
    !addressParameter.isFetching &&
    Boolean(addressParameter.data);

  const addDonation = useCallback((donation: QueuedDonation) => {
    setDonationsQueue((previous) => {
      if (
        previous.some((existingDonation) => {
          return existingDonation.txnHash === donation.txnHash;
        })
      ) {
        return previous;
      }
      return [...previous, donation];
    });
  }, []);

  useEffect(() => {
    if (isLegacyLink) return;
    if (!name) return;

    const overlayToken = window.location.pathname.split('/').pop()!;

    const socket: Socket = io(`${CREATOR_API_URL}/overlay`, {
      auth: { overlayToken },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Overlay socket connected');
    });

    socket.on('forceRefresh', () => {
      console.log('Got force refresh');
      const url = new URL(window.location.href);
      url.searchParams.set('t', Date.now().toString());
      window.location.href = url.toString();
    });

    socket.on('creatorConfigUpdated', (data) => {
      console.log('Got new settings', data);
      // update your local state with the new config
      setMinimumAmounts({
        minimumAlertAmount: data.donationParameters.minimumAlertAmount,
        minimumSfxAmount: data.donationParameters.minimumSfxAmount,
        minimumTTSAmount: data.donationParameters.minimumTTSAmount,
      });
      setEnableToggles({
        alertEnabled: data.donationParameters.alertEnabled,
        sfxEnabled: data.donationParameters.sfxEnabled,
        ttsEnabled: data.donationParameters.ttsEnabled,
      });
      setCustomBadWords(data.donationParameters.customBadWords ?? []);
      setAlertSound(data.donationParameters.alertSound);
      setVoiceId(data.donationParameters.voiceId);
    });

    socket.on('testDonation', (testDonation) => {
      console.log('Received test donation event via socket');
      console.log(enableToggles);
      console.log(minimumAmounts);
      console.log(testDonation);
      const queuedDonation: QueuedDonation = {
        ...testDonation,
        token: {
          ...testDonation.token,
          amount: BigInt(testDonation.token.amount),
        },
        minimumAmounts,
        enableToggles,
        alertSound,
        voiceId,
        creatorName: name,
        forceDisplay: true,
      };
      addDonation(queuedDonation);
    });

    socket.on('newDonation', async (donation: StoredDonationData) => {
      try {
        if (isLegacyLink) return;

        if (!address?.data) return;

        if (donation.toAddress.toLowerCase() !== address?.data.toLowerCase())
          return;

        const message = donation.comment ?? '';
        if (message && containsBadWords(message, customBadWords)) {
          console.log('Filtered donation with inappropriate message');
          return;
        }

        await new Promise((resolve) => {
          return setTimeout(resolve, 2500);
        });
        const sfxText = await fetchDonationSfxText(donation.transactionHash);
        if (sfxText && containsBadWords(sfxText, customBadWords)) {
          console.log('Filtered donation with inappropriate sfx text');
          return;
        }

        const donorDisplay =
          donation.fromUser?.displayName ?? donation.fromAddress;
        const avatarUrl = donation.fromUser?.avatarUrl;

        if (donation.kind === 'token') {
          const tokenDetails = donation.token
            ? {
                address: donation.token.address,
                symbol: donation.token.symbol,
                decimals: donation.token.decimals,
                name: donation.token.name ?? donation.token.symbol,
                logo: donation.token.imageUrl ?? '',
              }
            : undefined;

          addDonation({
            avatarUrl,
            message,
            sfxText,
            amount: String(donation.tradeValue), // string expected
            donor: donorDisplay,
            txnHash: donation.transactionHash,
            token: {
              amount: BigInt(donation.amountRaw),
              details: tokenDetails,
            },
            minimumAmounts,
            enableToggles,
            alertSound,
            voiceId,
            creatorName: name,
          });
        } else if (donation.kind === 'nft') {
          const nftLogo =
            donation.imgPreferred ??
            donation.imgLarge ??
            donation.imgMedium ??
            donation.imgSmall;

          addDonation({
            avatarUrl,
            message,
            sfxText,
            amount: String(donation.quantity),
            donor: donorDisplay,
            txnHash: donation.transactionHash,
            token: {
              amount: BigInt(donation.quantity),
              details: {
                id: BigInt(donation.tokenId),
                name: donation.name,
                logo: nftLogo,
                collectionName:
                  donation.collectionShortName ?? donation.collectionSlug,
              },
            },
            minimumAmounts,
            enableToggles,
            alertSound,
            voiceId,
            creatorName: name,
            forceDisplay: true,
          });
        }
      } catch (error) {
        console.error('Failed to handle newDonation event:', error);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Overlay auth failed:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [
    name,
    addDonation,
    minimumAmounts,
    enableToggles,
    alertSound,
    voiceId,
    isLegacyLink,
    customBadWords,
    address?.data,
  ]);

  // If creator name present use info from db, if not, use params only
  useEffect(() => {
    if (isLegacyLink) return;

    const updateCreatorInfo = () => {
      const slugFromUrl = window.location.pathname.split('/').pop();
      if (
        !addressParameter.isFetching &&
        addressParameter.data == null &&
        slugFromUrl
      ) {
        getPublicCreatorProfileBySlug(slugFromUrl)
          .then((profile) => {
            if (profile) {
              setName(profile.name);
              setAddress({
                data: profile.primaryAddress,
                isValid: isAddress(profile.primaryAddress),
                isFetching: false,
              });
              setMinimumAmounts({
                minimumAlertAmount: profile.minimumAlertAmount,
                minimumTTSAmount: profile.minimumTTSAmount,
                minimumSfxAmount: profile.minimumSfxAmount,
              });
              setEnableToggles({
                alertEnabled: profile.alertEnabled,
                sfxEnabled: profile.sfxEnabled,
                ttsEnabled: profile.ttsEnabled,
              });
              setCustomBadWords(profile.customBadWords ?? []);
              setAlertSound(profile.alertSound);
              setVoiceId(profile.voiceId);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (!addressParameter.isFetching && addressParameter.data) {
        setAddress({
          data: addressParameter.data,
          isValid: isAddress(addressParameter.data),
          isFetching: false,
        });
        setEnableToggles({
          alertEnabled: true,
          sfxEnabled: true,
          ttsEnabled: true,
        });
      } else if (
        !addressParameter.isFetching &&
        !addressParameter.data &&
        !slugFromUrl
      ) {
        router.push(MAIN_LANDING_LINK);
        return;
      }
    };

    updateCreatorInfo();
    const interval = setInterval(updateCreatorInfo, 60_000);

    return () => {
      return clearInterval(interval);
    };
  }, [
    router,
    addressParameter.data,
    addressParameter.isFetching,
    isLegacyLink,
  ]);

  const handleDonationFullyComplete = useCallback(() => {
    setDonationsQueue((previous) => {
      return previous.slice(1);
    });
    setIsDisplayingDonation(false);
  }, []);

  const displayNextDonation = useCallback(() => {
    if (donationsQueue.length > 0 && !isDisplayingDonation) {
      setIsDisplayingDonation(true);
    }
  }, [donationsQueue, isDisplayingDonation]);

  useEffect(() => {
    if (!isDisplayingDonation && donationsQueue.length > 0) {
      displayNextDonation();
    }
  }, [donationsQueue, isDisplayingDonation, displayNextDonation]);

  const currentDonationData = donationsQueue[0];
  const shouldDisplayDonation =
    !isLegacyLink && isDisplayingDonation && currentDonationData;

  return (
    <>
      <style>{`
        html {
          /* 16px at 450px width (450 / 16 = 28.125) */
          font-size: calc(100vw / 28.125);
        }
      `}</style>
      <div className="flex h-screen w-screen items-start justify-center bg-transparent p-3">
        {shouldDisplayDonation && (
          <DonationNotification
            {...currentDonationData}
            key={currentDonationData.txnHash}
            minOverallVisibleDuration={DONATION_MIN_OVERALL_VISIBLE_DURATION}
            onFullyComplete={handleDonationFullyComplete}
          />
        )}
      </div>
      {isLegacyLink && (
        <FullscreenOverlay className="bg-[#E7F5E6]/[0.6] backdrop-blur-sm">
          <p
            className={classes(
              'text-balance text-center text-heading5 text-neutralGreen-700',
            )}
          >
            This is a legacy donation overlay. Set up your account in
          </p>
          <p
            className={classes(
              'text-balance text-center text-heading5 text-neutralGreen-700',
            )}
          >
            <ExternalLink
              className={classes('text-mint-600 underline')}
              href={MAIN_LANDING_LINK}
            >
              IDRISS Creators&nbsp;v2
            </ExternalLink>{' '}
            to continue receiving donations.
          </p>
        </FullscreenOverlay>
      )}
    </>
  );
}
