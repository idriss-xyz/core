import { NextRequest, NextResponse } from 'next/server';

import {
  ZapperNode,
  TipHistoryVariables,
  ZapperResponse,
} from '@/app/creators/donate/types';
import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '@/app/creators/donate/constants';
import { fetchDonationsByToAddress } from '@/db/fetch-known-donations';
import { storeToDatabase } from '@/db/store-new-donation';

import {
  OLDEST_TRANSACTION_TIMESTAMP,
  PriceHistoryQuery,
  TipHistoryQuery,
} from './constants';

const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql';
const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => {
    return address.toLowerCase();
  },
);

async function enrichNodesWithHistoricalPrice(
  edges: { node: ZapperNode }[],
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const priceCache: Record<string, { timestamp: number; median: number }[]> =
    {};

  for (const edge of edges) {
    const node = edge.node;
    if (node.timestamp >= todayTimestamp) continue;

    const tokenItem = node.interpretation.descriptionDisplayItems[0];
    if (!tokenItem?.tokenV2) continue;

    const tokenAddress = tokenItem.tokenV2.address;
    const network = tokenItem.network;
    const cacheKey = `${tokenAddress}_${network}`;

    let priceTicks = priceCache[cacheKey];
    if (!priceTicks) {
      const variables = {
        address: tokenAddress,
        network,
        currency: 'USD',
        timeFrame: 'YEAR',
      };

      const encodedKey = Buffer.from(ZAPPER_API_KEY ?? '').toString('base64');
      const response = await fetch(ZAPPER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedKey}`,
        },
        body: JSON.stringify({
          query: PriceHistoryQuery,
          variables,
        }),
      });

      const json = await response.json();

      const fetchedTicks: { timestamp: number; median: number }[] =
        json.data?.fungibleToken?.onchainMarketData?.priceTicks ?? [];
      if (fetchedTicks.length === 0) continue;
      priceCache[cacheKey] = fetchedTicks;
      priceTicks = fetchedTicks;
    }

    let closestTick = priceTicks[0];
    let minDiff = Math.abs(node.timestamp - closestTick!.timestamp);
    for (const tick of priceTicks) {
      const diff = Math.abs(node.timestamp - tick.timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestTick = tick;
      } else if (diff > minDiff) {
        // Since ticks are chronological, we can stop early
        break;
      }
    }
    tokenItem.tokenV2.onchainMarketData.price = closestTick!.median;
  }
}

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

    const knownDonations = await fetchDonationsByToAddress(address);
    const knownDonationMap = new Map<string, ZapperNode>();
    for (const d of knownDonations) {
      if (d.transactionHash && d.data) {
        knownDonationMap.set(d.transactionHash.toLowerCase(), d.data);
      }
    }
    const knownHashes = new Set(knownDonationMap.keys());

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

      for (const edge of relevantEdges) {
        const txHash = edge.node.transaction.hash.toLowerCase();
        if (knownHashes.has(txHash)) {
          const enriched = knownDonationMap.get(txHash);
          if (enriched) {
            allRelevantEdges.push({ node: enriched });
          } else {
            allRelevantEdges.push(edge);
          }
        } else {
          newEdges.push(edge);
          allRelevantEdges.push(edge);
        }
      }

      if (
        relevantEdges.some((edge) => {
          return knownHashes.has(edge.node.transaction.hash.toLowerCase());
        })
      ) {
        break;
      }
      if (currentEdges.length === 0) break;
      const lastEdge = currentEdges.at(-1);
      if (lastEdge && lastEdge.node.timestamp < OLDEST_TRANSACTION_TIMESTAMP)
        break;

      hasNextPage = accountsTimeline.pageInfo?.hasNextPage;
      cursor = accountsTimeline.pageInfo?.endCursor ?? null;
    }

    if (newEdges.length > 0) {
      await enrichNodesWithHistoricalPrice(newEdges);
      await storeToDatabase(address, newEdges);
      for (const edge of newEdges) {
        knownDonationMap.set(
          edge.node.transaction.hash.toLowerCase(),
          edge.node,
        );
      }
    }

    return NextResponse.json({ data: [...allRelevantEdges] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tip history' },
      { status: 500 },
    );
  }
}
