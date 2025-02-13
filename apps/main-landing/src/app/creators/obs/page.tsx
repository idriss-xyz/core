'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  type AbiEvent,
  decodeFunctionData,
  type Hex,
  isAddress,
  parseAbiItem,
} from 'viem';
import { getEnsAvatar } from 'viem/actions';
import { normalize } from 'viem/ens';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  NATIVE_COIN_ADDRESS,
  TIPPING_ABI,
} from '../donate/constants';
import { ethereumClient } from '../donate/config';

import DonationNotification, {
  type DonationNotificationProperties,
} from './components/donation-notification';
import { clients } from './constants/blockchain-clients';
import {
  calculateDollar,
  resolveEnsName,
  resolveEnsToHex,
  TIP_MESSAGE_EVENT_ABI,
} from './utils';

const DONATION_DISPLAY_DURATION = 11_000;
const BLOCK_LOOKBACK_RANGE = 5n;
const FETCH_INTERVAL = 5000;

const latestCheckedBlocks = new Map();

// ts-unused-exports:disable-next-line
export default function Obs() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const [resolvedAddress, setResolvedAddress] = useState<Hex | null>(null);
  const [donationsQueue, setDonationsQueue] = useState<
    DonationNotificationProperties[]
  >([]);
  const [isDisplayingDonation, setIsDisplayingDonation] = useState(false);

  useEffect(() => {
    const resolveAddress = async () => {
      let address = searchParameters.get('streamerAddress');
      const newStreamerAddress = searchParameters.get('address');

      if (newStreamerAddress) {
        address = newStreamerAddress;
      }

      if (!address) {
        router.push('/creators');
        return;
      }

      if (isAddress(address)) {
        setResolvedAddress(address);
      } else {
        try {
          const resolved = await resolveEnsToHex(address);
          if (resolved && isAddress(resolved)) {
            setResolvedAddress(resolved);
          } else {
            console.error('Invalid ENS name or address provided:', address);
            router.push('/creators');
          }
        } catch (error) {
          console.error('Error resolving ENS or address:', error);
          router.push('/creators');
        }
      }
    };

    resolveAddress().catch((error) => {
      console.error('Unexpected error resolving address:', error);
      router.push('/creators');
    });
  }, [searchParameters, router]);

  const displayNextDonation = useCallback(() => {
    setIsDisplayingDonation(true);

    setTimeout(() => {
      setDonationsQueue((previous) => {
        return previous.slice(1);
      });
      setIsDisplayingDonation(false);
    }, DONATION_DISPLAY_DURATION);
  }, [setDonationsQueue]);

  const addDonation = useCallback(
    (donation: DonationNotificationProperties) => {
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
    },
    [],
  );

  const fetchTipMessageLogs = useCallback(async () => {
    if (!resolvedAddress) return;

    for (const { chain, client, name } of clients) {
      try {
        const latestBlock = await client.getBlockNumber();
        const lastCheckedBlock =
          latestCheckedBlocks.get(chain) || latestBlock - BLOCK_LOOKBACK_RANGE;

        if (latestBlock <= lastCheckedBlock) continue;

        const eventSignature = TIP_MESSAGE_EVENT_ABI[name];

        if (!eventSignature) {
          console.warn(`Unsupported event signature for chain: ${name}`);
          continue;
        }

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

          if (!recipient || !tokenAmount) {
            continue;
          }

          if (recipient.toLowerCase() !== resolvedAddress.toLowerCase())
            continue;

          const resolved = await resolveEnsName(txn.from);

          const senderIdentifier =
            resolved ?? `${txn.from.slice(0, 4)}...${txn.from.slice(-2)}`;

          const donorAvatar = resolved
            ? await getEnsAvatar(ethereumClient, {
                name: normalize(resolved),
              })
            : null;

          const avatarUrl = donorAvatar ?? undefined;

          const amountInDollar = await calculateDollar(
            tokenAddress as Hex,
            tokenAmount,
            chain,
          );

          addDonation({
            txnHash: log.transactionHash!,
            donor: senderIdentifier,
            amount: amountInDollar,
            message: message ?? '',
            avatarUrl,
          });
        }
      } catch (error) {
        console.error('Error fetching tip message log:', error);
      }
    }
  }, [resolvedAddress, addDonation]);

  useEffect(() => {
    if (!resolvedAddress) return;

    const intervalId = setInterval(fetchTipMessageLogs, FETCH_INTERVAL);
    return () => {
      return clearInterval(intervalId);
    };
  }, [resolvedAddress, fetchTipMessageLogs]);

  useEffect(() => {
    if (!isDisplayingDonation && donationsQueue.length > 0) {
      displayNextDonation();
    }
  }, [donationsQueue, isDisplayingDonation, displayNextDonation]);

  const currentDonation = donationsQueue[0];
  const shouldDisplayDonation = isDisplayingDonation && currentDonation;

  return (
    <div className="h-screen w-full bg-transparent">
      {shouldDisplayDonation && (
        <DonationNotification
          key={currentDonation.txnHash}
          {...currentDonation}
        />
      )}
    </div>
  );
}
