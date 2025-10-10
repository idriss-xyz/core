import {
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../../constants';
import { fetchAllKnownDonationHashes } from '../../db/fetch-known-donations';
import { storeToDatabase } from '../../db/store-new-donation';
import { AppHistoryVariables, ZapperNode, ZapperResponse } from '../../types';
import { enrichNodesWithHistoricalPrice } from '../../utils/enrich-nodes';
import { StoredDonationData } from '@idriss-xyz/constants';
import { isStringItem, isTokenItem } from '../../utils/zapper-type-guards';

export async function syncAndStoreNewDonations(): Promise<
  StoredDonationData[]
> {
  const knownHashes = await fetchAllKnownDonationHashes();

  const newEdges: { node: ZapperNode }[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const variables: AppHistoryVariables = { slug: 'idriss', after: cursor };
    const encodedKey = Buffer.from(process.env.ZAPPER_API_KEY ?? '').toString(
      'base64',
    );
    const response = await fetch(ZAPPER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedKey}`,
      },
      body: JSON.stringify({ query: TipHistoryQuery, variables }),
    });

    const data: ZapperResponse = await response.json();
    const appTimeline = data.data?.transactionsForAppV2;
    if (!appTimeline) break;

    const currentEdges = appTimeline.edges || [];

    const relevantEdges = currentEdges.filter((edge) => {
      if (edge.node.app?.slug !== 'idriss') return false;
      if (knownHashes.has(edge.node.transaction.hash.toLowerCase())) {
        return false;
      }
      const items = edge.node.interpretation?.descriptionDisplayItems ?? [];
      const data = edge.node.transaction.decodedInputV2.data;
      const hasValidData =
        data.length > 0 && data[data.length - 1].value.length > 0;
      const hasAnyNftDelta = (edge.node.accountDeltasV2?.edges ?? []).some(
        (e) =>
          (e.node.nftDeltasV2?.edges ?? []).some((d) => Boolean(d.node.nft)),
      );
      if (!hasValidData && !hasAnyNftDelta) return false;

      const stringItem = items.find(isStringItem);

      const tokenItem = items.find(isTokenItem);

      if (stringItem?.stringValue) {
        if (stringItem.stringValue === 'N/A') return false;
        if (tokenItem && stringItem.stringValue === tokenItem.amountRaw) {
          return false;
        }
      }
      return true;
    });

    newEdges.push(...relevantEdges);

    if (
      currentEdges.some((edge) =>
        knownHashes.has(edge.node.transaction.hash.toLowerCase()),
      )
    ) {
      break; // Stop if we find a transaction we already have
    }

    if (currentEdges.length === 0) break;
    const lastEdge = currentEdges.at(-1);
    if (lastEdge && lastEdge.node.timestamp < OLDEST_TRANSACTION_TIMESTAMP) {
      break;
    }

    hasNextPage = appTimeline.pageInfo?.hasNextPage;
    cursor = appTimeline.pageInfo?.endCursor ?? null;
  }

  let storedDonations: StoredDonationData[] = [];
  if (newEdges.length > 0) {
    await enrichNodesWithHistoricalPrice(newEdges);
    storedDonations = await storeToDatabase(newEdges);
  }

  return storedDonations;
}
