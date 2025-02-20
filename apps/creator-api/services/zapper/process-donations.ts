import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../../constants';
import { fetchDonationsByToAddress } from '../../db/fetch-known-donations';
import { storeToDatabase } from '../../db/store-new-donation';
import { TipHistoryVariables, ZapperNode, ZapperResponse } from '../../types';
import { enrichNodesWithHistoricalPrice } from '../../utils/enrich-nodes';

import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../../utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;
const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (addr) => addr.toLowerCase(),
);

export async function processNewDonations(
  address: string,
): Promise<{ newEdges: { node: ZapperNode }[] }> {
  const knownDonations = await fetchDonationsByToAddress(address);
  const knownHashes = new Set(
    knownDonations.map((d) => d.transactionHash.toLowerCase()),
  );
  console.log('Known hashaes:', knownDonations.length);

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
      body: JSON.stringify({ query: TipHistoryQuery, variables }),
    });
    const data: ZapperResponse = await response.json();
    console.log('DATA FROM ZAPPER: ', data);
    const accountsTimeline = data.data?.accountsTimeline;
    if (!accountsTimeline) break;

    const currentEdges = accountsTimeline.edges || [];
    const relevantEdges = currentEdges.filter(
      (edge) => edge.node.app?.slug === 'idriss',
    );

    for (const edge of relevantEdges) {
      const txHash = edge.node.transaction.hash.toLowerCase();
      if (!knownHashes.has(txHash)) {
        newEdges.push(edge);
      }
    }

    if (
      relevantEdges.some((edge) =>
        knownHashes.has(edge.node.transaction.hash.toLowerCase()),
      )
    )
      break;
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
  }
  return { newEdges };
}
