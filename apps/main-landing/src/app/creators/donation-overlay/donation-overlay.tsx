'use client';

import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { type AbiEvent, type Hex, isAddress, parseAbiItem } from 'viem';
import {
  CHAIN_ID_TO_TOKENS,
  CREATOR_API_URL,
  CREATORS_LINK,
  DEFAULT_ALLOWED_CHAINS_IDS,
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  NATIVE_COIN_ADDRESS,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import { clients } from '@idriss-xyz/blockchain-clients';
import { FullscreenOverlay } from '@idriss-xyz/ui/fullscreen-overlay';
import { ExternalLink } from '@idriss-xyz/ui/external-link';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '../donate/constants';
import { useCreators } from '../hooks/use-creators';
import {
  getPublicCreatorProfileBySlug,
  getCreatorNameAndPicOrAnon,
  getNftMetadata,
} from '../utils';
import { Address } from '../donate/types';

import DonationNotification from './components/donation-notification';
import {
  calculateDollar,
  fetchDonationSfxText,
  TIP_MESSAGE_EVENT_ABI,
} from './utils';
import { containsBadWords } from './utils/bad-words';
import { DonationNotificationProperties, MinimumAmounts } from './types';

const FETCH_INTERVAL = 5000;
const BLOCK_LOOKBACK_RANGE = 5n;
const DONATION_MIN_OVERALL_VISIBLE_DURATION = 11_000;

const latestCheckedBlocks = new Map();
//todo: remove
// latestCheckedBlocks.set(8453, BigInt(	35_973_508));

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
      setCustomBadWords(data.donationParameters.customBadWords);
      setAlertSound(data.donationParameters.alertSound);
      setVoiceId(data.donationParameters.voiceId);
    });

    socket.on('testDonation', (testDonation) => {
      console.log('Received test donation event via socket');
      console.log(enableToggles);
      console.log(minimumAmounts);
      try {
        const queuedDonation: QueuedDonation = {
          avatarUrl: testDonation.avatarUrl,
          message: testDonation.message,
          sfxText: testDonation.sfxText,
          amount: '2',
          donor: testDonation.donor,
          txnHash: testDonation.txnHash,
          token: {
            amount: BigInt(1),
            details: {
              id: BigInt('100400158'),
              name: 'Embedded Agent',
              logo: 'https://nftmedia.parallelnft.com/parallel-aftermath/QmPPNj5MpR9FcxzPUu2gKQygNp5gxNvxwGgTkAGaef6mX9/image.png',
              collectionName: 'Parallel Aftermath',
            },
          },
          minimumAmounts,
          enableToggles,
          alertSound,
          voiceId,
          creatorName: name,
          forceDisplay: true,
        };
        addDonation(queuedDonation);
      } catch (error) {
        console.error('Error processing test donation:', error);
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
              setCustomBadWords(profile.customBadWords);
              setAlertSound(profile.alertSound);
              setVoiceId(profile.voiceId);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (!addressParameter.isFetching && addressParameter.data) {
        setAddress({
          // todo: revert
          // data: '0x100A3316aD8AFc50554153789373fA8b96948769',
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
        router.push(CREATORS_LINK);
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

  const fetchTipMessageLogs = useCallback(async () => {
    if (isLegacyLink) return;

    if (!address?.data) return;

    for (const { chain, client } of clients) {
      try {
        const eventSignature = TIP_MESSAGE_EVENT_ABI;
        if (!DEFAULT_ALLOWED_CHAINS_IDS.includes(chain)) {
          continue;
        }

        const latestBlock = await client.getBlockNumber();
        const lastCheckedBlock =
          latestCheckedBlocks.get(chain) ?? latestBlock - BLOCK_LOOKBACK_RANGE;

        if (latestBlock <= lastCheckedBlock) continue;

        const parsedEvent = parseAbiItem(eventSignature) as AbiEvent;

        const tipMessageLogs = await client.getLogs({
          address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[chain],
          event: parsedEvent,
          fromBlock: lastCheckedBlock + 1n,
          toBlock: latestBlock,
        });

        latestCheckedBlocks.set(chain, latestBlock);

        if (tipMessageLogs.length === 0) {
          continue;
        }

        for (const log of tipMessageLogs) {
          if (!log.topics) {
            continue;
          }

          // destructure event arguments
          const {
            recipientAddress,
            message,
            sender,
            tokenAddress,
            amount,
            assetType,
            assetId,
          } = log.args as {
            recipientAddress: Hex;
            message: string;
            sender: Hex;
            tokenAddress: Hex;
            amount: bigint;
            fee: bigint;
            assetType: number;
            assetId: bigint;
          };

          console.log(
            'Found donation props',
            recipientAddress,
            message,
            amount,
            assetType,
            typeof assetType,
            assetId,
            tokenAddress,
          );

          if (recipientAddress.toLowerCase() !== address?.data.toLowerCase())
            continue;

          if (message && containsBadWords(message, customBadWords)) {
            console.log('Filtered donation with inappropriate message');
            continue;
          }

          const { profilePicUrl, name: resolvedName } =
            await getCreatorNameAndPicOrAnon(sender);

          const effectiveTokenAddress =
            tokenAddress === NULL_ADDRESS ? NATIVE_COIN_ADDRESS : tokenAddress;

          /* ── fetch SFX text once for either asset type ─────────────── */
          await new Promise((resolve) => {
            return setTimeout(resolve, 2500);
          });
          const sfxText = await fetchDonationSfxText(log.transactionHash!);

          if (sfxText && containsBadWords(sfxText, customBadWords)) {
            console.log('Filtered donation with inappropriate sfx text');
            continue; // skip this log
          }

          const isToken = assetType <= 1n && assetId === 0n;

          if (isToken) {
            const amountInDollar = await calculateDollar(
              effectiveTokenAddress,
              amount,
              chain,
            );

            const tokenDetails = CHAIN_ID_TO_TOKENS[chain]?.find((token) => {
              return (
                token.address?.toLowerCase() ===
                effectiveTokenAddress.toLowerCase()
              );
            });

            if (!name) {
              console.error('Creator name not available, skipping donation');
              continue;
            }

            addDonation({
              avatarUrl: profilePicUrl,
              message: message ?? '',
              sfxText,
              amount: amountInDollar,
              donor: resolvedName,
              txnHash: log.transactionHash!,
              token: {
                amount: amount,
                details: tokenDetails,
              },
              minimumAmounts,
              enableToggles,
              alertSound,
              voiceId,
              creatorName: name,
            });
            continue; // prevent fall-through
          }

          const {
            name: nftName,
            image: nftImage,
            collectionName,
          } = await getNftMetadata(
            client,
            effectiveTokenAddress,
            assetId,
            assetType,
          );

          console.log('Using nft add donation with', {
            id: assetId,
            name: nftName,
            logo: nftImage,
            collectionName,
          });
          addDonation({
            avatarUrl: profilePicUrl,
            message: message ?? '',
            sfxText,
            amount: amount.toString(),
            donor: resolvedName,
            txnHash: log.transactionHash!,
            token: {
              amount,
              details: {
                id: assetId,
                name: nftName,
                logo: nftImage,
                collectionName,
              },
            },
            minimumAmounts,
            enableToggles,
            alertSound,
            voiceId,
            creatorName: name,
            forceDisplay: true, // always display NFTs for now
          });
        }
      } catch (error) {
        console.error('Error fetching tip message log:', error);
      }
    }
  }, [
    address?.data,
    addDonation,
    minimumAmounts,
    enableToggles,
    customBadWords,
    alertSound,
    voiceId,
    name,
    isLegacyLink,
  ]);

  const savedFetchTipMessageLogs = useRef(fetchTipMessageLogs);

  useEffect(() => {
    savedFetchTipMessageLogs.current = fetchTipMessageLogs;
  }, [fetchTipMessageLogs]);

  useEffect(() => {
    if (!isDisplayingDonation && donationsQueue.length > 0) {
      displayNextDonation();
    }
  }, [donationsQueue, isDisplayingDonation, displayNextDonation]);

  useEffect(() => {
    if (isLegacyLink) return;

    if (!address?.isValid) return;

    const intervalId = setInterval(() => {
      return savedFetchTipMessageLogs.current();
    }, FETCH_INTERVAL);

    return () => {
      return clearInterval(intervalId);
    };
    // TODO: check why adding fetchTipMessageLogs makes infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address?.isValid, isLegacyLink]);

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
      <div className="flex h-screen w-screen items-center bg-transparent p-3">
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
          <p className="text-balance text-center text-heading5 text-neutralGreen-700">
            This is a legacy donation overlay. Set up your account in
          </p>
          <p className="text-balance text-center text-heading5 text-neutralGreen-700">
            <ExternalLink
              className="text-mint-600 underline"
              href={CREATORS_LINK}
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
