import cors from 'cors';
import { Router, Request, Response } from 'express';
import { generateNonce, SiweMessage } from 'siwe';
import { getAddress } from 'viem';
import { verifyToken } from '../db/middleware/auth.middleware';
import { AppDataSource } from '../db/database';
import { Creator, CreatorAddress } from '../db/entities';
import { MAIN_LANDING_LINK } from '@idriss-xyz/constants';

const router = Router();

const siweCors = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    cb(null, origin === MAIN_LANDING_LINK);
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

const nonceStore = new Map<string, string>();

router.options('/nonce', siweCors);
router.get('/nonce', siweCors, verifyToken(), (req: Request, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const nonce = generateNonce();
  nonceStore.set(req.user.id, nonce);

  res.json({ nonce });
  return;
});

router.options('/verify', siweCors);
router.post(
  '/verify',
  siweCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);
      const creatorAddressRepository =
        AppDataSource.getRepository(CreatorAddress);

      const creator = await creatorRepository.findOne({
        where: { privyId: req.user.id },
      });
      if (!creator) {
        res.status(404).json({ error: 'Creator profile not found' });
        return;
      }

      const { message, signature } = req.body ?? {};
      if (typeof message !== 'string' || typeof signature !== 'string') {
        res.status(400).json({ error: 'Invalid payload' });
        return;
      }

      const expectedNonce = nonceStore.get(req.user.id);
      if (!expectedNonce) {
        res.status(400).json({ error: 'Nonce missing' });
        return;
      }

      const siwe = new SiweMessage(message);
      if (siwe.nonce !== expectedNonce) {
        res.status(401).json({ error: 'Bad nonce' });
        return;
      }
      if (siwe.domain !== req.hostname) {
        res.status(401).json({ error: 'Bad domain' });
        return;
      }

      const { success, data } = await siwe.verify({
        signature,
        domain: siwe.domain,
        nonce: expectedNonce,
        time: new Date().toISOString(),
      });
      if (!success) {
        res.status(401).json({ error: 'SIWE verify failed' });
        return;
      }

      nonceStore.delete(req.user.id);

      const formattedAddress = getAddress(data.address);
      const creatorId = creator.id;

      const existingAddressInCreator = await creatorRepository.findOne({
        where: { address: formattedAddress },
      });

      const existingAddressInCreatorAddress =
        await creatorAddressRepository.findOne({
          where: { address: formattedAddress, creator: { id: creatorId } },
        });

      if (existingAddressInCreatorAddress || existingAddressInCreator) {
        res.status(409).json({ error: 'Address already exists for a creator' });
        return;
      }

      const creatorAddress = creatorAddressRepository.create({
        address: formattedAddress,
        creator,
      });
      const savedAddress = await creatorAddressRepository.save(creatorAddress);

      res.status(201).json({
        id: savedAddress.id,
        address: savedAddress.address,
        creatorId: creator.id,
      });
      return;
    } catch (e) {
      res.status(500).json({ error: 'Internal error' });
      return;
    }
  },
);

export default router;
