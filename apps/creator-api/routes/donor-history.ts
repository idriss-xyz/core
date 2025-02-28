import { Router, Request, Response } from 'express';
import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../constants';
import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import { calculateStatsForDonorAddress } from '../utils/calculate-stats';
import { TipHistoryVariables, ZapperNode, ZapperResponse } from '../types';
import { enrichNodesWithHistoricalPrice } from '../utils/enrich-nodes';
import { storeToDatabase } from '../db/store-new-donation';
import dotenv from 'dotenv';
import { mode } from '../utils/mode';
import { join } from 'path';

const router = Router();

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => address.toLowerCase(),
);

// Instead of fetching here with zapper again, trust that the
// donations db is complete and simply calculate the stats
router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    // Fetch known donations from the database
    const knownDonations = await fetchDonationsByFromAddress(address);
    const knownDonationMap = new Map<string, ZapperNode>();
    for (const donation of knownDonations) {
      if (donation.transactionHash && donation.data) {
        knownDonationMap.set(
          donation.transactionHash.toLowerCase(),
          donation.data,
        );
      }
    }
    const knownHashes = new Set(knownDonationMap.keys());

    // Fetch new donations from Zapper
    const newEdges: { node: ZapperNode }[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables: TipHistoryVariables = {
        addresses: [address],
        toAddresses: app_addresses,
        isSigner: true,
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

    // Enrich and store new donations
    if (newEdges.length > 0) {
      await enrichNodesWithHistoricalPrice(newEdges);
      await storeToDatabase(address, newEdges);
    }

    // Combine all relevant donations
    const allRelevantEdges = newEdges.map((edge) => edge.node);
    const allDonations = [
      ...allRelevantEdges,
      ...Array.from(knownDonationMap.values()).filter(
        (node) =>
          !allRelevantEdges.some(
            (edge) =>
              edge.transaction.hash.toLowerCase() ===
              node.transaction.hash.toLowerCase(),
          ),
      ),
    ];

    // Calculate stats using all donations
    const stats = calculateStatsForDonorAddress(allDonations);

    res.json({ data: allDonations, stats });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
