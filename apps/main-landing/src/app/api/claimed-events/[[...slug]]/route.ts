import { NextResponse } from 'next/server';

import { ClaimEvent } from '@/constants';
import { loadExistingEvents } from '@/utils';

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
      // only look at LP positions
      const score = [
        {
          address: '0x896C20Da40c2A4df9B7C98B16a8D5A95129161a5',
          score: '22748040300000000000000',
        },
        {
          address: '0x656A78630F31432E6F35F6996AF5C0a4E445655c',
          score: '176711200000000000000',
        },
      ];
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
