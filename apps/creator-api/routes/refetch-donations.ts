import { Request, Response } from 'express';
import express from 'express';
import { processAllDonations } from '../services/zapper/process-donations';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { join } from 'path';
import { mode } from '../utils/mode';
import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '../constants';
import { Hex } from 'viem';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const router = express.Router();
const overwrite = true;

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => address.toLowerCase() as Hex,
);

const validationRules = [
  body('secret').isString().notEmpty(),
  body('oldestTransactionTimestamp').isInt().toInt(),
];

router.post('/', validationRules, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  try {
    const { secret, addresses, oldestTransactionTimestamp } = req.body;

    if (secret !== SECRET_PASSWORD) {
      res.status(401).json({ error: 'Unauthorized: Invalid secret password' });
      return;
    }

    if (!addresses) {
      res.status(400).json({ error: 'Invalid or missing addresses parameter' });
      return;
    }
    let addressesArray: Hex[];

    if (typeof addresses === 'string') {
      addressesArray = addresses.split(',').map((addr) => addr.trim() as Hex);
    } else if (Array.isArray(addresses)) {
      addressesArray = addresses as Hex[];
    } else {
      res.status(400).json({
        error: 'Addresses must be a Hex string or an array of Hex strings',
      });
      return;
    }

    await processAllDonations({
      address: addressesArray,
      toAddresses: app_addresses,
      oldestTransactionTimestamp,
      overwrite,
    });
    // ai! add a simple return for this success case mentioning how many transactions have been updated
  } catch (error) {
    console.error('Overwrite donation error:', error);
    res.status(500).json({ error: 'Failed to process donation data' });
  }
});

export default router;
