import { Router, Request, Response } from 'express';
import { Hex } from 'viem';
import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
import { TipHistoryResponse } from '../types';
import { syncAndStoreNewDonations } from '../services/zapper/process-donations';
import { connectedClients } from '../services/socket-server';
import { calculateDonationLeaderboard } from '@idriss-xyz/utils';
import { DonationData } from '@idriss-xyz/constants';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DEMO_ADDRESS } from '../tests/test-data/constants';

const router = Router();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 6;
const RETRY_INTERVAL = 5000;

/**
 * Shared logic to fetch and process tip history for a given address.
 */
async function handleFetchTipHistory(req: Request, res: Response) {
  try {
    // Support address from either URL parameter (GET) or body (POST)
    const address = (req.params.address || req.body.address) as string;

    if (address && address === DEMO_ADDRESS) {
      const mockData = JSON.parse(
        readFileSync(
          resolve(__dirname, '../tests/test-data/mock-donations.json'),
          'utf-8',
        ),
      );
      res.json(mockData);
      return;
    }

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

// --- Endpoint 2: Sync All Donations and Push to Clients ---
router.post('/sync', async (req: Request, res: Response) => {
  try {
    // Address of the creator expecting the donation, used to control retries.
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const lowerCaseAddress = address.toLowerCase();

    let retries = 0;
    let foundDonationForUser = false;
    const allNewlySyncedDonations: DonationData[] = [];

    while (retries < MAX_RETRIES && !foundDonationForUser) {
      if (retries > 0) {
        await delay(RETRY_INTERVAL);
      }
      retries++;

      const newDonations = await syncAndStoreNewDonations();

      // Always process all new donations found in this batch
      if (newDonations.length > 0) {
        allNewlySyncedDonations.push(...newDonations);

        // Distribute ALL new donations to their respective clients via WebSockets
        for (const donation of newDonations) {
          const clients = connectedClients.get(
            donation.toAddress.toLowerCase(),
          );
          if (clients) {
            for (const socket of clients) {
              socket.emit('newDonation', donation);
            }
          }
        }
        break;
      }
    }

    if (allNewlySyncedDonations.length > 0) {
      res.json({ data: allNewlySyncedDonations });
    } else {
      res.status(200).json({ message: 'No new donations found after retries' });
    }
  } catch (error) {
    console.error('Donation sync error:', error);
    res.status(500).json({ error: 'Failed to sync donation data' });
  }
});

export default router;
