import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../../constants';
import { fetchDonationsByToAddress } from '../../db/fetch-known-donations';
import { storeToDatabase } from '../../db/store-new-donation';
import {
  DonationData,
  TipHistoryVariables,
  ZapperNode,
  ZapperResponse,
} from '../../types';
import { enrichNodesWithHistoricalPrice } from '../../utils/enrich-nodes';

import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../../utils/mode';
import { Hex } from 'viem';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;
const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (addr) => addr.toLowerCase() as Hex,
);

export async function processAllDonations(options: {
  address: Hex | Hex[];
  toAddresses?: Hex[];
  oldestTransactionTimestamp?: number;
  isSigner?: boolean;
  overwrite: boolean;
}): Promise<{ donations: DonationData[] }> {
  const {
    address,
    toAddresses = app_addresses,
    oldestTransactionTimestamp = OLDEST_TRANSACTION_TIMESTAMP,
    isSigner = false,
    overwrite,
  } = options;

  const addressesArray = Array.isArray(address) ? address : [address];

  const newEdges: { node: ZapperNode }[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const variables: TipHistoryVariables = {
      addresses: addressesArray,
      toAddresses,
      isSigner,
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
    const accountsTimeline = data.data?.accountsTimeline;
    if (!accountsTimeline) break;

    const currentEdges = accountsTimeline.edges || [];
    const relevantEdges = currentEdges.filter((edge) => {
      if (edge.node.app?.slug !== 'idriss') return false;

      const descriptionItems =
        edge.node.interpretation?.descriptionDisplayItems;
      const data = edge.node.transaction.decodedInputV2.data;

      // Check if last element of data exists and has value
      const hasValidData =
        data.length > 0 && data[data.length - 1].value.length > 0;
      if (!hasValidData) return false;

      // If we have a message (descriptionItems[2]), validate it
      if (descriptionItems?.[2]?.stringValue) {
        // stringValue is "N/A"
        if (descriptionItems[2].stringValue === 'N/A') return false;

        // string value is amountRaw (old tagging)
        if (
          descriptionItems[2].stringValue === descriptionItems[0]?.amountRaw
        ) {
          return false;
        }
      }

      return true;
    });

    for (const edge of relevantEdges) {
      newEdges.push(edge);
    }

    if (currentEdges.length === 0) break;
    const lastEdge = currentEdges[currentEdges.length - 1];
    if (lastEdge && lastEdge.node.timestamp < oldestTransactionTimestamp) break;

    hasNextPage = accountsTimeline.pageInfo?.hasNextPage;
    cursor = accountsTimeline.pageInfo?.endCursor ?? null;
  }

  let allDonations: DonationData[] = [];
  if (newEdges.length > 0) {
    await enrichNodesWithHistoricalPrice(newEdges);
    const groupedByToAddress: Record<Hex, ZapperNode[]> = newEdges.reduce(
      (acc, edge) => {
        const descriptionItems =
          edge.node.interpretation.descriptionDisplayItems;
        if (
          descriptionItems.length <= 1 ||
          !descriptionItems[1]?.account?.address
        ) {
          return acc;
        }
        const toAddress = descriptionItems[1].account.address as Hex;
        if (!acc[toAddress]) {
          acc[toAddress] = [];
        }
        acc[toAddress].push(edge.node);
        return acc;
      },
      {} as Record<Hex, ZapperNode[]>,
    );

    for (const [toAddress, edges] of Object.entries(groupedByToAddress)) {
      const donations = await storeToDatabase(
        toAddress as Hex,
        edges.map((edge) => ({ node: edge })),
        overwrite,
      );
      allDonations = allDonations.concat(donations);
    }
  }

  return { donations: allDonations };
}

export async function processNewDonations(
  address: Hex,
): Promise<{ storedDonations: DonationData[] }> {
  const knownDonations = await fetchDonationsByToAddress(address);
  const knownHashes = new Set(
    knownDonations.map((d) => d.transactionHash.toLowerCase()),
  );

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
    const accountsTimeline = data.data?.accountsTimeline;
    if (!accountsTimeline) break;

    const currentEdges = accountsTimeline.edges || [];
    const relevantEdges = currentEdges.filter((edge) => {
      if (edge.node.app?.slug !== 'idriss') return false;

      const descriptionItems =
        edge.node.interpretation?.descriptionDisplayItems;
      const data = edge.node.transaction.decodedInputV2.data;

      // Check if last element of data exists and has value
      const hasValidData =
        data.length > 0 && data[data.length - 1].value.length > 0;
      if (!hasValidData) return false;

      // If we have a message (descriptionItems[2]), validate it
      if (descriptionItems?.[2]?.stringValue) {
        // stringValue is "N/A"
        if (descriptionItems[2].stringValue === 'N/A') return false;

        // string value is amountRaw (old tagging)
        if (
          descriptionItems[2].stringValue === descriptionItems[0]?.amountRaw
        ) {
          return false;
        }
      }

      return true;
    });

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

  let storedDonations: DonationData[] = [];
  if (newEdges.length > 0) {
    await enrichNodesWithHistoricalPrice(newEdges);
    storedDonations = await storeToDatabase(address, newEdges);
  }
  return { storedDonations };
}
