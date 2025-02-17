import { Request, Response } from 'express';

import express from 'express';
import { processNewDonations } from '../services/zapper/process-donations';
import { connectedClients } from '../services/socket-server';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    const { newEdges } = await processNewDonations(address);

    const clients = connectedClients.get(address);
    if (clients) {
      for (const edge of newEdges) {
        for (const socket of clients) {
          socket.emit('newDonation', edge.node);
        }
      }
    }

    res.json({ data: newEdges });
  } catch (error) {
    console.error('Donation update error:', error);
    res.status(500).json({ error: 'Failed to update donation data' });
  }
});

export default router;
