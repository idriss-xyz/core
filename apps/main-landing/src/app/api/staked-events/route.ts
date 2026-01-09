import fs from 'node:fs';
import path from 'node:path';

import { formatEther, Hex, parseAbiItem } from 'viem';
import { NextResponse } from 'next/server';
import { STAKER_ADDRESS } from '@idriss-xyz/constants';
import { clientBase } from '@idriss-xyz/blockchain-clients';

import { STAKED_EVENT, WITHDRAWN_EVENT } from '@/app/vault/constants';
import { STAKED_EVENTS_FILE_PATH } from '@/constants';

interface StakeEvent {
  user: Hex | undefined;
  amount: string | undefined;
  type: 'staked' | 'withdrawn';
  transactionHash: Hex | undefined;
  timestamp: number | undefined;
}

interface ApiResponse {
  error?: string;
  events?: StakeEvent[];
}

const BLOCK_RANGE = 5000n;
const STARTING_BLOCK = 25_614_733n;

const fetchStakeEvents = async (
  fromBlock: bigint,
  toBlock: bigint,
): Promise<StakeEvent[]> => {
  const events: StakeEvent[] = [];

  while (fromBlock <= toBlock) {
    const endBlock =
      fromBlock + BLOCK_RANGE > toBlock ? toBlock : fromBlock + BLOCK_RANGE;

    const stakedLogs = await clientBase.getLogs({
      address: STAKER_ADDRESS,
      event: parseAbiItem(STAKED_EVENT),
      fromBlock,
      toBlock: endBlock,
    });

    for (const log of stakedLogs) {
      const { args, transactionHash, blockNumber } = log;
      if (args) {
        const { user, amount } = args;

        if (!user || !amount) {
          continue;
        }

        const block = await clientBase.getBlock({ blockNumber });
        const timestamp = Number(block.timestamp);

        events.push({
          user,
          amount: formatEther(amount),
          type: 'staked',
          transactionHash,
          timestamp,
        });
      }
    }

    const withdrawnLogs = await clientBase.getLogs({
      address: STAKER_ADDRESS,
      event: parseAbiItem(WITHDRAWN_EVENT),
      fromBlock,
      toBlock: endBlock,
    });

    for (const log of withdrawnLogs) {
      const { args, transactionHash, blockNumber } = log;
      if (args) {
        const { user, amount } = args;

        if (!user || !amount) {
          continue;
        }

        const block = await clientBase.getBlock({ blockNumber });
        const timestamp = Number(block.timestamp);

        events.push({
          user,
          amount: formatEther(amount),
          type: 'withdrawn',
          transactionHash,
          timestamp,
        });
      }
    }

    fromBlock = endBlock + 1n;
  }

  return events;
};

const loadExistingEvents = (): {
  events: StakeEvent[];
  lastProcessedBlock: bigint;
} => {
  if (!fs.existsSync(STAKED_EVENTS_FILE_PATH)) {
    return { events: [], lastProcessedBlock: STARTING_BLOCK };
  }

  const stat = fs.statSync(STAKED_EVENTS_FILE_PATH);
  if (!stat.isFile()) {
    return { events: [], lastProcessedBlock: STARTING_BLOCK };
  }

  const data = JSON.parse(fs.readFileSync(STAKED_EVENTS_FILE_PATH, 'utf8'));

  return {
    events: data.events ?? [],
    lastProcessedBlock: data.lastProcessedBlock
      ? BigInt(data.lastProcessedBlock)
      : STARTING_BLOCK,
  };
};

const saveEventsToFile = (events: StakeEvent[], lastProcessedBlock: bigint) => {
  const dir = path.dirname(STAKED_EVENTS_FILE_PATH);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    STAKED_EVENTS_FILE_PATH,
    JSON.stringify(
      {
        events,
        lastProcessedBlock: lastProcessedBlock.toString(),
      },
      null,
      2,
    ),
    'utf8',
  );
};

// ts-unused-exports:disable-next-line
export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const { events: existingEvents, lastProcessedBlock } = loadExistingEvents();

    const latestBlock = await clientBase.getBlockNumber();
    if (lastProcessedBlock >= latestBlock) {
      return NextResponse.json({ events: existingEvents });
    }

    const newEvents = await fetchStakeEvents(
      lastProcessedBlock + 1n,
      latestBlock,
    );

    if (newEvents.length > 0) {
      const updatedEvents = [...existingEvents, ...newEvents];
      saveEventsToFile(updatedEvents, latestBlock);
      return NextResponse.json({ events: updatedEvents });
    }

    return NextResponse.json({ events: existingEvents });
  } catch (error) {
    console.error('[ERROR] Failed fetching or saving stake events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
