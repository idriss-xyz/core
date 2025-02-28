import { Request, Response } from 'express';
import express from 'express';
import { processAllDonations } from '../services/zapper/process-donations';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { connectedClients } from '../services/socket-server';
import { ZapperNode } from '../types/services.types';
import dotenv from 'dotenv';
import { join } from 'path';
import { mode } from '../../utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const router = express.Router();

// Rate Limiting Middleware
const overwriteDonationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Validation Rules
const validationRules = [
  body('secret').isString().notEmpty(),
  body('addresses').isArray({ min: 1 }),
  body('addresses.*').isString().isHexadecimal().isLength({ min: 42, max: 42 }),
  body('toAddresses').isArray({ min: 1 }),
  body('toAddresses.*').isString().isHexadecimal().isLength({ min: 42, max: 42 }),
  body('oldestTransactionTimestamp').isInt().toInt(),
];

router.post('/', overwriteDonationLimiter, validationRules, async (req: Request, res: Response) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { secret, addresses, toAddresses, oldestTransactionTimestamp } = req.body;

    if (secret !== SECRET_PASSWORD) {
      res.status(401).json({ error: 'Unauthorized: Invalid secret password' });
      return;
    }

    if (!addresses || !Array.isArray(addresses)) {
      res.status(400).json({ error: 'Invalid or missing addresses parameter' });
      return;
    }

    const result = await processAllDonations({
      addresses,
      toAddresses,
      oldestTransactionTimestamp,
    });

    if (result.newEdges.length > 0) {
      // Notify connected clients
      const clients = connectedClients.get(addresses[0]);
      if (clients) {
        for (const edge of result.newEdges) {
          for (const socket of clients) {
            socket.emit('newDonation', edge.node);
          }
        }
      }
      res.json({ data: result.newEdges });
    } else {
      res.json({ message: 'No new donations found' });
    }
  } catch (error) {
    console.error('Overwrite donation error:', error);
    res.status(500).json({ error: 'Failed to process donation data' });
  }
});

export default router;
