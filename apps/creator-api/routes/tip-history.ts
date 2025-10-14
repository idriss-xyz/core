import { Router, Request, Response } from 'express';
import { fetchDonationsByToAddress } from '@idriss-xyz/db';
import { TipHistoryResponse } from '../types';
import {
  calculateDonationLeaderboard,
  createAddressToCreatorMap,
} from '@idriss-xyz/utils';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { DEMO_ADDRESS, StoredDonationData } from '@idriss-xyz/constants';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { AppDataSource } from '@idriss-xyz/db';
import { Creator } from '@idriss-xyz/db';
import { resolveCreatorAndAddresses } from '../utils/calculate-stats';

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
    const identifier = (req.params.address || req.body.address) as string;

    if (identifier && identifier === DEMO_ADDRESS) {
      const mockData = JSON.parse(
        readFileSync(
          resolve(__dirname, '../tests/test-data/mock-donations.json'),
          'utf-8',
        ),
      );
      res.json(mockData);
      return;
    }

    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    const { addresses: allAddresses } =
      await resolveCreatorAndAddresses(identifier);

    const donations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByToAddress(addr)),
      )
    ).flat();

    const creatorRepository = AppDataSource.getRepository(Creator);
    const allCreators = await creatorRepository.find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(allCreators);

    enrichDonationsWithCreatorInfo(donations, addressToCreatorMap);

    const leaderboard = await calculateDonationLeaderboard(
      donations,
      addressToCreatorMap,
    );

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

// // --- Endpoint 2: Sync All Donations and Push to Clients ---
// router.post('/sync', async (req: Request, res: Response) => {
//   try {
//     // Address of the creator expecting the donation, used to control retries.
//     const { address } = req.body;
//     if (!address || typeof address !== 'string') {
//       res.status(400).json({ error: 'Invalid or missing address' });
//       return;
//     }

//     let retries = 0;
//     let foundDonationForUser = false;
//     const allNewlySyncedDonations: StoredDonationData[] = [];

//     while (retries < MAX_RETRIES && !foundDonationForUser) {
//       if (retries > 0) {
//         await delay(RETRY_INTERVAL);
//       }
//       retries++;

//       const newDonations = await syncAndStoreNewDonations();

//       // Always process all new donations found in this batch
//       if (newDonations.length > 0) {
//         allNewlySyncedDonations.push(...newDonations);

//         // Check if the donation for the specific user is in this batch
//         if (
//           newDonations.some(
//             (d) => d.toAddress.toLowerCase() === address.toLowerCase(),
//           )
//         ) {
//           foundDonationForUser = true;
//         }

//         // Distribute ALL new donations to their respective clients via WebSockets
//         for (const donation of newDonations) {
//           const clients = connectedClients.get(
//             donation.toAddress.toLowerCase(),
//           );
//           if (clients) {
//             for (const socket of clients) {
//               socket.emit('newDonation', donation);
//             }
//           }
//         }
//       }
//     }

//     if (allNewlySyncedDonations.length > 0) {
//       res.json({ data: allNewlySyncedDonations });
//     } else {
//       res.status(200).json({ message: 'No new donations found after retries' });
//     }
//   } catch (error) {
//     console.error('Donation sync error:', error);
//     res.status(500).json({ error: 'Failed to sync donation data' });
//   }
// });

export default router;
