import { Router, Request, Response, RequestHandler } from 'express';
import { StoredDonationData } from '@idriss-xyz/constants';
import { connectedClients } from '../services/socket-server';

const router = Router();

const verifyInternalAuth: RequestHandler = (req, res, next) => {
  const auth = req.get('authorization') || '';
  const expected = `Bearer ${process.env.INTERNAL_SYNC_TOKEN}`;
  if (!process.env.INTERNAL_SYNC_TOKEN || auth !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};

router.post('/donations', verifyInternalAuth, (req: Request, res: Response) => {
  const donation = req.body as StoredDonationData;

  if (
    !donation ||
    typeof donation !== 'object' ||
    !donation.toAddress ||
    !donation.transactionHash
  ) {
    res.status(400).json({ error: 'Invalid payload' });
    return;
  }

  const to = donation.toAddress.toLowerCase();

  const clients = connectedClients.get(to);
  if (clients && clients.size > 0) {
    for (const socket of clients) {
      socket.emit('newDonation', donation);
    }
  }

  res.status(204).end();
});

export default router;
