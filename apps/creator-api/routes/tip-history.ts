import { Router, Request, Response } from 'express';
import { Hex } from 'viem';
import {
  TipHistoryQuery,
  OLDEST_TRANSACTION_TIMESTAMP,
  ZAPPER_API_URL,
} from '../constants';
import {
  fetchDonationsByToAddress,
  fetchAllKnownDonationHashes,
} from '../db/fetch-known-donations';
import { storeToDatabase } from '../db/store-new-donation';
import {
  AppHistoryVariables,
  TipHistoryResponse,
  ZapperNode,
  ZapperResponse,
} from '../types';
import { calculateDonationLeaderboard } from '../utils/calculate-stats';
import { enrichNodesWithHistoricalPrice } from '../utils/enrich-nodes';

const router = Router();

/**
 * Shared logic to fetch and process tip history for a given address.
 */
async function handleFetchTipHistory(req: Request, res: Response) {
  try {
    // Support address from either URL parameter (GET) or body (POST)
    const address = (req.params.address || req.body.address) as string;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const hexAddress = address as Hex;

    const donations = await fetchDonationsByToAddress(hexAddress);
    const leaderboard = await calculateDonationLeaderboard(donations);

    const response: TipHistoryResponse = {
      donations,
      leaderboard,
    };

    res.json(response);
  } catch (error) {
    console.error('Fetch tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
}

// --- Endpoint 1: NEW and CORRECT way to fetch history ---
// This is the new, preferred GET endpoint.
router.get('/:address', handleFetchTipHistory);

// --- Endpoint 1.1: BACKWARD COMPATIBILITY for old clients ---
// This keeps the old POST endpoint working.
router.post('/', handleFetchTipHistory);

// --- Endpoint 2: Sync All Donations (for a scheduled job/cron) ---
// This endpoint fetches all app transactions from Zapper and stores new ones.
router.post('/sync', async (req: Request, res: Response) => {
  try {
    // 1. Get all transaction hashes already stored in your database.
    const knownHashes = await fetchAllKnownDonationHashes();

    const newEdges: { node: ZapperNode }[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    // 2. Loop through Zapper API to find new transactions.
    while (hasNextPage) {
      const variables: AppHistoryVariables = {
        slug: 'idriss',
        after: cursor,
      };

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

      // Filter for valid, new donations
      const relevantEdges = currentEdges.filter((edge) => {
        if (edge.node.app?.slug !== 'idriss') return false;
        const txHash = edge.node.transaction.hash.toLowerCase();
        if (knownHashes.has(txHash)) return false;

        const descriptionItems =
          edge.node.interpretation?.descriptionDisplayItems;
        const data = edge.node.transaction.decodedInputV2.data;
        const hasValidData =
          data.length > 0 && data[data.length - 1].value.length > 0;
        if (!hasValidData) return false;

        if (descriptionItems?.[2]?.stringValue) {
          if (descriptionItems[2].stringValue === 'N/A') return false;
          if (
            descriptionItems[2].stringValue === descriptionItems[0]?.amountRaw
          ) {
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

    let storedCount = 0;
    if (newEdges.length > 0) {
      // 3. Enrich and store the new donations.
      await enrichNodesWithHistoricalPrice(newEdges);
      const storedDonations = await storeToDatabase(newEdges);
      storedCount = storedDonations.length;
    }

    res.json({
      status: 'success',
      newDonationsSynced: storedCount,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync donations' });
  }
});

export default router;
