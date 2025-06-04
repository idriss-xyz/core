import { NextResponse } from 'next/server';
import { parseEther } from 'viem';

import { loadExistingEvents } from '@/utils';
import { ClaimEvent } from '@/constants';

interface ApiResponse {
  error?: string;
  events?: ClaimEvent[];
  score?: { address: string; score: string }[];
}

// ts-unused-exports:disable-next-line
export function GET(request: Request): NextResponse<ApiResponse> {
  try {
    const url = new URL(request.url);
    const snapshotParameter = url.searchParams.get('snapshot');
    const addressesFormat = url.searchParams.get('addresses');
    const snapshotFormat = snapshotParameter && addressesFormat;

    const { events } = loadExistingEvents();

    if (snapshotFormat) {
      const score = events
        .filter((event) => {
          return event.bonus;
        })
        .map((event) => {
          return {
            address: event.to!,
            score: (parseEther(event.total!) * 2n).toString(),
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
