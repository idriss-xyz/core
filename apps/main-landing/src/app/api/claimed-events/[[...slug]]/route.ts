import fs from 'node:fs';

import { NextResponse } from 'next/server';
import { Hex, parseEther } from 'viem';

interface ClaimEvent {
  to: Hex | undefined;
  total: string | undefined;
  bonus: boolean | undefined;
  transactionHash: Hex | undefined;
}

interface ApiResponse {
  error?: string;
  events?: ClaimEvent[];
  score?: { address: string; score: string }[];
}

const DATA_DIRECTORY_PATH = './data';
const DATA_FILE_PATH = `${DATA_DIRECTORY_PATH}/claimed-events.json`;
const STARTING_BLOCK = 25_614_734n;

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

// ts-unused-exports:disable-next-line
export function GET(request: Request): NextResponse<ApiResponse> {
  try {
    const url = new URL(request.url);
    const snapshotParameter = url.searchParams.get('snapshot');
    const addressesFormat = url.searchParams.get('addresses');
    const snapshotFormat = snapshotParameter && addressesFormat;

    const { events: existingEvents } = loadExistingEvents();
    const events = existingEvents;

    if (snapshotFormat) {
      const score = events
        .filter((event) => {
          return event.bonus;
        })
        .map((event) => {
          return {
            address: event.to!,
            score: parseEther(event.total!).toString(),
          };
        });
      return NextResponse.json({ score });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching or saving claimed events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 },
    );
  }
}
