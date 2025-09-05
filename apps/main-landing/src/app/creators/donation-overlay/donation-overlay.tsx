'use client';

import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  type AbiEvent,
  decodeFunctionData,
  type Hex,
  isAddress,
  parseAbiItem,
} from 'viem';
import {
  CHAIN_ID_TO_TOKENS,
  CREATOR_API_URL,
  CREATORS_LINK,
  DEFAULT_DONATION_MIN_ALERT_AMOUNT,
  DEFAULT_DONATION_MIN_SFX_AMOUNT,
  DEFAULT_DONATION_MIN_TTS_AMOUNT,
  NATIVE_COIN_ADDRESS,
  TIPPING_ABI,
} from '@idriss-xyz/constants';
import { clients } from '@idriss-xyz/blockchain-clients';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '../donate/constants';
import { useCreators } from '../hooks/use-creators';
import {
  getPublicCreatorProfileBySlug,
  getCreatorNameAndPicOrAnon,
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

  const router = useRouter();
  const [isDisplayingDonation, setIsDisplayingDonation] = useState(false);
  const [donationsQueue, setDonationsQueue] = useState<QueuedDonation[]>([]);

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
    if (!name) return;

    const overlayToken = window.location.pathname.split('/').pop()!;
    console.log(overlayToken);

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
          amount: testDonation.amount,
          donor: testDonation.donor,
          txnHash: testDonation.txnHash,
          token: {
            amount: BigInt(testDonation.token.amount),
            details: testDonation.token.details,
          },
          minimumAmounts,
          enableToggles,
          alertSound,
          voiceId,
          creatorName: name,
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
  }, [name, addDonation, minimumAmounts, enableToggles, alertSound, voiceId]);

  // If creator name present use info from db, if not, use params only
  useEffect(() => {
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
  }, [router, addressParameter.data, addressParameter.isFetching]);

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
    if (!address?.data) return;

    for (const { chain, client, name: chainName } of clients) {
      try {
        const eventSignature = TIP_MESSAGE_EVENT_ABI[chainName];
        if (!eventSignature) {
          continue;
        }

        const latestBlock = await client.getBlockNumber();
        const lastCheckedBlock =
          latestCheckedBlocks.get(chain) || latestBlock - BLOCK_LOOKBACK_RANGE;

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

          const txn = await client.getTransaction({
            hash: log.transactionHash!,
          });

          const decoded = decodeFunctionData({
            abi: TIPPING_ABI,
            data: txn.input,
          });

          let recipient, tokenAmount, tokenAddress, message;

          if (decoded.functionName === 'sendTo') {
            [recipient, tokenAmount, message] = decoded.args;
            tokenAddress = NATIVE_COIN_ADDRESS;
          } else if (decoded.functionName === 'sendTokenTo') {
            [recipient, tokenAmount, tokenAddress, message] = decoded.args;
          }

          if (!recipient || !tokenAmount || !tokenAddress) {
            continue;
          }

          if (recipient.toLowerCase() !== address?.data.toLowerCase()) continue;

          if (message && containsBadWords(message, customBadWords)) {
            console.log('Filtered donation with inappropriate message');
            continue;
          }

          const { profilePicUrl, name: resolvedName } =
            await getCreatorNameAndPicOrAnon(txn.from);

          const amountInDollar = await calculateDollar(
            tokenAddress as Hex,
            tokenAmount,
            chain,
          );

          const tokenDetails = CHAIN_ID_TO_TOKENS[chain]?.find((token) => {
            return (
              token.address?.toLowerCase() ===
              (tokenAddress as Hex).toLowerCase()
            );
          });

          await new Promise((resolve) => {
            return setTimeout(resolve, 2500);
          });

          const sfxText = await fetchDonationSfxText(log.transactionHash!);

          if (sfxText && containsBadWords(sfxText, customBadWords)) {
            console.log('Filtered donation with inappropriate sfx text');
            continue;
          }

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
              amount: tokenAmount,
              details: tokenDetails,
            },
            minimumAmounts,
            enableToggles,
            alertSound,
            voiceId,
            creatorName: name,
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
    if (!address?.isValid) return;

    const intervalId = setInterval(() => {
      return savedFetchTipMessageLogs.current();
    }, FETCH_INTERVAL);

    return () => {
      return clearInterval(intervalId);
    };
    // TODO: check why adding fetchTipMessageLogs makes infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address?.isValid]);

  const currentDonationData = donationsQueue[0];
  const shouldDisplayDonation = isDisplayingDonation && currentDonationData;

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
    </>
  );
}
