import fs from 'node:fs';

import { createPublicClient, formatEther, Hex, http, parseAbiItem } from 'viem';
import { base } from 'viem/chains';
import { NextResponse } from 'next/server';

import { CLAIM_CONTRACT_ADDRESS, CLAIMED_EVENT } from '@/app/vault/constants';

interface ClaimEvent {
  to: Hex | undefined;
  total: string | undefined;
  bonus: boolean | undefined;
  transactionHash: Hex | undefined;
}

interface ApiResponse {
  error?: string;
  events?: ClaimEvent[];
}

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://base-rpc.publicnode.com'),
});

const DATA_DIRECTORY_PATH = './data';
const DATA_FILE_PATH = `${DATA_DIRECTORY_PATH}/claimed-events.json`;
const BLOCK_RANGE = 5000n;
const STARTING_BLOCK = 25_614_734n;

const fetchClaimedEvents = async (
  fromBlock: bigint,
  toBlock: bigint,
): Promise<ClaimEvent[]> => {
  const events: ClaimEvent[] = [];

  while (fromBlock <= toBlock) {
    const endBlock =
      fromBlock + BLOCK_RANGE > toBlock ? toBlock : fromBlock + BLOCK_RANGE;

    const claimLogs = await publicClient.getLogs({
      address: CLAIM_CONTRACT_ADDRESS,
      event: parseAbiItem(CLAIMED_EVENT),
      fromBlock,
      toBlock: endBlock,
    });

    for (const log of claimLogs) {
      const { args, transactionHash } = log;
      if (args) {
        const { to, total, bonus } = args;
        const adjustedTotal = bonus
          ? Number.parseFloat(formatEther(total!)) * 2
          : Number.parseFloat(formatEther(total!));

        events.push({
          to,
          total: adjustedTotal.toString(),
          bonus,
          transactionHash,
        });
      }
    }

    fromBlock = endBlock + 1n;
  }

  return events;
};

const loadExistingEvents = (): {
  events: ClaimEvent[];
  lastProcessedBlock: bigint;
} => {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
    return {
      events: data.events ?? [],
      lastProcessedBlock: data.lastProcessedBlock
        ? BigInt(data.lastProcessedBlock)
        : STARTING_BLOCK,
    };
  }
  return { events: [], lastProcessedBlock: STARTING_BLOCK };
};

const deduplicateEvents = (events: ClaimEvent[]): ClaimEvent[] => {
  const uniqueEvents = new Map(
    events.map((event) => {
      return [event.to, event];
    }),
  );
  return [...uniqueEvents.values()];
};

const saveEventsToFile = (events: ClaimEvent[], lastProcessedBlock: bigint) => {
  if (!fs.existsSync(DATA_DIRECTORY_PATH)) {
    fs.mkdirSync(DATA_DIRECTORY_PATH, { recursive: true });
  }

  const data = {
    events,
    lastProcessedBlock: lastProcessedBlock.toString(),
  };

  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// ts-unused-exports:disable-next-line
export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const { events: existingEvents, lastProcessedBlock } = loadExistingEvents();

    const latestBlock = await publicClient.getBlockNumber();
    if (lastProcessedBlock >= latestBlock) {
      return NextResponse.json({ events: existingEvents });
    }

    const newEvents = await fetchClaimedEvents(
      lastProcessedBlock + 1n,
      latestBlock,
    );

    if (newEvents.length > 0) {
      const updatedEvents = deduplicateEvents([
        ...existingEvents,
        ...newEvents,
      ]);
      saveEventsToFile(updatedEvents, latestBlock);
      return NextResponse.json({ events: updatedEvents });
    }

    return NextResponse.json({ events: existingEvents });
  } catch (error) {
    console.error('Error fetching or saving claimed events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
