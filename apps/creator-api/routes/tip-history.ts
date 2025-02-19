import { Router, Request, Response } from 'express';
import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../constants';
import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
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

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    const knownDonations = await fetchDonationsByToAddress(address);
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
        if (knownHashes.has(txHash)) {
          const enriched = knownDonationMap.get(txHash);
          allRelevantEdges.push({ node: enriched ? enriched : edge.node });
        } else {
          newEdges.push(edge);
          allRelevantEdges.push(edge);
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
      for (const edge of newEdges) {
        knownDonationMap.set(
          edge.node.transaction.hash.toLowerCase(),
          edge.node,
        );
      }
    }

    res.json({ data: [...allRelevantEdges] });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
