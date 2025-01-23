import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { throwInternalError } from '../middleware/error.middleware';
import { isAddress } from 'viem';
import { join } from 'path';
import { mode } from '../utils/mode';
import {
  createMessage,
  login,
  validateMessage,
  validateToken,
} from '../services/auth';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  const { signature, walletAddress, message } = req.body;

  if (!isAddress(walletAddress)) {
    res.status(403).json({ error: 'Invalid wallet address' });
    return;
  }

  try {
    const valid = await validateMessage(walletAddress, message, signature);

    if (!valid) {
      res.status(403).json({ error: 'Invalid signature' });
      return;
    }

    const token = await login(walletAddress);

    res.status(200).send({ token });
  } catch (err) {}
});

router.post('/wallet-address', async (req, res) => {
  try {
    const { walletAddress, chainId, domain } = req.body;

    const message = await createMessage(walletAddress, chainId, domain);

    res.status(200).json({ message });
  } catch (err) {
    throwInternalError(res, 'Error generating login message: ', err);
  }
});

router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    const user = await validateToken(token);

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    res.status(200).send('Token is valid');
  } catch (err) {
    res.status(401).send('Invalid token');
  }
});

export default router;
