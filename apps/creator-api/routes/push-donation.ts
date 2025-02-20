import { Request, Response } from 'express';
import express from 'express';
import { processNewDonations } from '../services/zapper/process-donations';
import { connectedClients } from '../services/socket-server';
import { ZapperNode } from '../types';

const router = express.Router();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 6;
const RETRY_INTERVAL = 5000;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    console.log('Address in push donation', address);
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    let retries = 0;
    let newEdges = <{ node: ZapperNode }[]>[];

    await delay(RETRY_INTERVAL);

    while (retries < MAX_RETRIES) {
      const result = await processNewDonations(address);
      newEdges = result.newEdges;

      if (newEdges.length > 0) {
        console.log('Found new edge');
        break;
      }

      retries++;
      console.log(
        `No new edges found, retrying... (${retries}/${MAX_RETRIES})`,
      );

      await delay(RETRY_INTERVAL);
    }

    if (newEdges.length > 0) {
      const clients = connectedClients.get(address);
      if (clients) {
        for (const edge of newEdges) {
          for (const socket of clients) {
            console.log('Emitting new edge to', socket.id);
            socket.emit('newDonation', edge.node);
          }
        }
      }

      res.json({ data: newEdges });
    } else {
      res.status(200).json({ message: 'No new donations found after retries' });
    }
  } catch (error) {
    console.error('Donation update error:', error);
    res.status(500).json({ error: 'Failed to update donation data' });
  }
});

export default router;
