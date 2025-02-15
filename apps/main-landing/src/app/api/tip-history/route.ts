import { NextRequest, NextResponse } from 'next/server';

import {
  Node,
  TipHistoryVariables,
  ZapperResponse,
} from '@/app/creators/donate-history/types';
import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '@/app/creators/donate/constants';

import { OLDEST_TRANSACTION_TIMESTAMP, TipHistoryQuery } from './constants';

const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql';
const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => {
    return address.toLowerCase();
  },
);

// ts-unused-exports:disable-next-line
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing address' },
        { status: 400 },
      );
    }

    let allRelevantEdges: {
      node: Node;
    }[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables: TipHistoryVariables = {
        addresses: [address],
        toAddresses: app_addresses,
        isSigner: false,
        after: cursor,
      };

      const encodedKey = Buffer.from(ZAPPER_API_KEY ?? '').toString('base64');

      const response = await fetch(ZAPPER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedKey}`,
        },
        body: JSON.stringify({
          query: TipHistoryQuery,
          variables,
        }),
      });

      const data: ZapperResponse = await response.json();

      const accountsTimeline = data.data?.accountsTimeline;
      if (!accountsTimeline) break;

      const currentEdges = accountsTimeline.edges || [];
      const relevantEdges = (accountsTimeline.edges || []).filter((tip) => {
        return tip.node.app?.slug === 'idriss';
      });

      allRelevantEdges = [...allRelevantEdges, ...relevantEdges];

      if (currentEdges.length === 0) break;

      const lastEdge = currentEdges.at(-1);
      if (lastEdge && lastEdge.node.timestamp < OLDEST_TRANSACTION_TIMESTAMP)
        break;

      hasNextPage = accountsTimeline.pageInfo?.hasNextPage;
      cursor = accountsTimeline.pageInfo?.endCursor ?? null;
    }

    // Uncomment to store data in your DB
    // await storeToDatabase(allRelevantEdges);

    return NextResponse.json({ data: allRelevantEdges });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tip history' },
      { status: 500 },
    );
  }
}
