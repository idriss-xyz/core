import {
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../../constants';
import { fetchDonationsByToAddress } from '../../db/fetch-known-donations';
import { storeToDatabase } from '../../db/store-new-donation';
import {
  AppHistoryVariables,
  DonationData,
  ZapperNode,
  ZapperResponse,
} from '../../types';
import { enrichNodesWithHistoricalPrice } from '../../utils/enrich-nodes';
import { Hex } from 'viem';

const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;

export async function processAllDonations(options: {
  address: Hex | Hex[];
  toAddresses?: Hex[];
  oldestTransactionTimestamp?: number;
  isSigner?: boolean;
  overwrite: boolean;
}): Promise<{ donations: DonationData[] }> {
  const {
    oldestTransactionTimestamp = OLDEST_TRANSACTION_TIMESTAMP,
    overwrite,
  } = options;

  const newEdges: { node: ZapperNode }[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const variables: AppHistoryVariables = {
      slug: 'idriss',
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
    const accountsTimeline = data.data?.transactionsForAppV2;
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
    const donations = await storeToDatabase(newEdges, overwrite);
    allDonations = allDonations.concat(donations);
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
    const variables: AppHistoryVariables = {
      slug: 'idriss',
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
    const accountsTimeline = data.data?.transactionsForAppV2;
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
      const toAddress =
        edge.node.interpretation?.descriptionDisplayItems?.[1]?.account
          ?.address;
      // This function is for a specific user, so only process donations to that address.
      if (toAddress?.toLowerCase() !== address.toLowerCase()) {
        continue;
      }
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
    storedDonations = await storeToDatabase(newEdges);
  }
  return { storedDonations };
}
