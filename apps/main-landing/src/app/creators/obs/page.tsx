'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  type AbiEvent,
  decodeFunctionData,
  type Hex,
  parseAbiItem,
} from 'viem';
import { getEnsAvatar } from 'viem/actions';
import { normalize } from 'viem/ens';
import { CHAIN_ID_TO_TOKENS, NATIVE_COIN_ADDRESS } from '@idriss-xyz/constants';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  TIPPING_ABI,
} from '../donate/constants';
import { ethereumClient } from '../donate/config';
import { useCreators } from '../hooks/use-creators';

import DonationNotification, {
  type DonationNotificationProperties,
} from './components/donation-notification';
import { clients } from './constants/blockchain-clients';
import {
  calculateDollar,
  resolveEnsName,
  TIP_MESSAGE_EVENT_ABI,
} from './utils';

const FETCH_INTERVAL = 5000;
const BLOCK_LOOKBACK_RANGE = 5n;
const DONATION_DISPLAY_DURATION = 11_000;

const latestCheckedBlocks = new Map();

// ts-unused-exports:disable-next-line
export default function Obs() {
  const {
    searchParams: { address },
  } = useCreators();
  const router = useRouter();
  const [isDisplayingDonation, setIsDisplayingDonation] = useState(false);
  const [donationsQueue, setDonationsQueue] = useState<
    DonationNotificationProperties[]
  >([]);

  useEffect(() => {
    if (!address.isFetching && !address.isValid) {
      router.push('/creators');

      return;
    }
  }, [router, address.isValid, address.isFetching]);

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
    if (!address.data) return;

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

          if (!recipient || !tokenAmount || !tokenAddress) {
            continue;
          }

          if (recipient.toLowerCase() !== address.data.toLowerCase()) continue;

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

          const tokenDetails = CHAIN_ID_TO_TOKENS[chain]?.find((token) => {
            return (
              token.address.toLowerCase() ===
              (tokenAddress as Hex).toLowerCase()
            );
          });

          addDonation({
            avatarUrl: avatarUrl,
            message: message ?? '',
            amount: amountInDollar,
            donor: senderIdentifier,
            txnHash: log.transactionHash!,
            token: {
              amount: tokenAmount,
              details: tokenDetails,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching tip message log:', error);
      }
    }
  }, [address.data, addDonation]);

  useEffect(() => {
    if (!address.isValid) return;

    const intervalId = setInterval(fetchTipMessageLogs, FETCH_INTERVAL);

    return () => {
      return clearInterval(intervalId);
    };
  }, [fetchTipMessageLogs, address.isValid]);

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
          {...currentDonation}
          key={currentDonation.txnHash}
        />
      )}
    </div>
  );
}
