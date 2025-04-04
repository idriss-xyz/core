import { Router, Request, Response } from 'express';
import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  OLDEST_TRANSACTION_TIMESTAMP,
  TipHistoryQuery,
  ZAPPER_API_URL,
} from '../constants';

import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
import {
  DonationData,
  TipHistoryResponse,
  TipHistoryVariables,
  ZapperNode,
  ZapperResponse,
} from '../types';
import { enrichNodesWithHistoricalPrice } from '../utils/enrich-nodes';
import { storeToDatabase } from '../db/store-new-donation';
import dotenv from 'dotenv';
import { mode } from '../utils/mode';
import { join } from 'path';
import { Hex } from 'viem';
import { calculateDonationLeaderboard } from '../utils/calculate-stats';

const router = Router();

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => address.toLowerCase() as Hex,
);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const hexAddress = address as Hex;
    const knownDonations = await fetchDonationsByToAddress(hexAddress);
    const knownDonationMap = new Map<string, DonationData>();
    for (const donation of knownDonations) {
      knownDonationMap.set(donation.transactionHash.toLowerCase(), donation);
    }
    const knownHashes = new Set(knownDonationMap.keys());

    const newEdges: { node: ZapperNode }[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables: TipHistoryVariables = {
        addresses: [hexAddress],
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

      const relevantEdges = currentEdges.filter((edge) => {
        if (edge.node.app?.slug !== 'idriss') return false;

        const descriptionItems =
          edge.node.interpretation?.descriptionDisplayItems;

        // stringValue is undefined
        if (!descriptionItems?.[2]?.stringValue) return false;

        // stringValue is "N/A"
        if (descriptionItems[2].stringValue === 'N/A') return false;

        // Check if last element of data exists and has value
        const data = edge.node.transaction.decodedInputV2.data;
        if (data.length === 0 || data[data.length - 1].value.length === 0) {
          return false;
        }

        // string value is amountRaw (old tagging)
        if (
          descriptionItems[2].stringValue === descriptionItems[0]?.amountRaw
        ) {
          return false;
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

    if (newEdges.length > 0) {
      await enrichNodesWithHistoricalPrice(newEdges);
      const storedDonations = await storeToDatabase(hexAddress, newEdges);
      for (const donation of storedDonations) {
        knownDonationMap.set(donation.transactionHash.toLowerCase(), donation);
      }
    }

    // Get leaderboard data
    const leaderboard = await calculateDonationLeaderboard(
      Array.from(knownDonationMap.values()),
    );

    // Return the structured response
    const response: TipHistoryResponse = {
      donations: Array.from(knownDonationMap.values()),
      leaderboard,
    };

    res.json(response);
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
