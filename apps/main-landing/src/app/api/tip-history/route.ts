import { NextRequest, NextResponse } from 'next/server';

import {
  ZapperNode,
  TipHistoryVariables,
  ZapperResponse,
} from '@/app/creators/donate-history/types';
import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '@/app/creators/donate/constants';
import { fetchDonationsByToAddress } from '@/db/fetch-known-donations';
import { storeToDatabase } from '@/db/store-new-donation';

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

    // Fetch known donations for all tipping addresses
    const knownDonationsArray = await Promise.all(
      app_addresses.map((toAddress) => {
        return fetchDonationsByToAddress(toAddress);
      }),
    );
    const knownDonations = knownDonationsArray.flat();
    const knownHashes = new Set(
      knownDonations.map((d) => {
        return d.transactionHash;
      }),
    );

    const allRelevantEdges: { node: ZapperNode }[] = [];
    const newEdges: { node: ZapperNode }[] = [];
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
      const relevantEdges = currentEdges.filter((edge) => {
        return edge.node.app?.slug === 'idriss';
      });

      // Collect only new transactions
      const newPageEdges = relevantEdges.filter((edge) => {
        return !knownHashes.has(edge.node.transaction.hash);
      });
      newEdges.push(...newPageEdges);
      allRelevantEdges.push(...relevantEdges);

      // Stop if any known transaction is found in this page
      if (
        relevantEdges.some((edge) => {
          return knownHashes.has(edge.node.transaction.hash);
        })
      )
        break;

      if (currentEdges.length === 0) break;

      const lastEdge = currentEdges.at(-1);
      if (lastEdge && lastEdge.node.timestamp < OLDEST_TRANSACTION_TIMESTAMP)
        break;

      hasNextPage = accountsTimeline.pageInfo?.hasNextPage;
      cursor = accountsTimeline.pageInfo?.endCursor ?? null;
    }

    // Store new transactions in the DB
    if (newEdges.length > 0) {
      await storeToDatabase(newEdges);
    }

    return NextResponse.json({
      data: allRelevantEdges,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tip history' },
      { status: 500 },
    );
  }
}
