import { Router, Request, Response } from 'express';

import { Hex } from 'viem';

import dotenv from 'dotenv';
import { AppDataSource } from '../db/database';
import { Creator, Referral } from '../db/entities';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { verifyToken } from '../db/middleware/auth.middleware';
import { LAMBDA_CLIENT, SIGNING_LAMBDA_NAME } from '../config/aws-config';

dotenv.config();

const router = Router();

router.post('/:address', verifyToken(), async (req: Request, res: Response) => {
  const address = req.params.address;
  if (!address) {
    console.error('Invalid creator address provided');
    res.status(400).json({ error: 'Invalid creator address provided' });
    return;
  }
  const hexAddress = address as Hex;

  const creatorRepository = AppDataSource.getRepository(Creator);
  const creator = await creatorRepository.findOne({
    where: { address: hexAddress },
  });

  if (!creator) {
    console.error('Creator with given address does not exist');
    res
      .status(400)
      .json({ error: 'Creator with given address does not exist' });
    return;
  }

  const referralRepository = AppDataSource.getRepository(Referral);

  const referrals = await referralRepository.find({
    where: { referrer: { id: creator.id }, credited: false },
    relations: ['referrer'],
  });

  if (referrals.length < 1) {
    console.error('No referrals to claim');
    res.status(400).json({ error: 'No referrals to claim' });
    return;
  }

  const rewardsToClaim = referrals
    .filter((referral) => !referral.credited)
    .reduce((sum, referral) => sum + referral.reward, 0);

  if (rewardsToClaim === 0) {
    console.error('No rewards to claim');
    res.status(400).json({ error: 'No rewards to claim' });
    return;
  }

  // todo: Calculate unsigned transaction hash. Temporary value is hardcoded.
  const txHash =
    '0xa3f4c51234abcdef5678deadbeef9abc1234567890fedcba9876543210abcdef0'; // your digest

  const command = new InvokeCommand({
    FunctionName: SIGNING_LAMBDA_NAME,
    Payload: Buffer.from(JSON.stringify({ txHash })),
  });

  let payload;

  try {
    const response = await LAMBDA_CLIENT.send(command);

    payload = response.Payload
      ? JSON.parse(new TextDecoder().decode(response.Payload))
      : null;

    if (!payload) {
      console.error('Payload is null');
      res.status(400).json({ error: 'Payload is null' });
      return;
    }
  } catch (err) {
    console.error('Lambda invoke error:', err);
    res.status(400).json({ error: 'Transaction failed' });
    return;
  }

  try {
    await AppDataSource.transaction(async (manager) => {
      // Perform transaction

      // If successful update referrals as credited
      await manager.update(
        Referral,
        { referrer: { id: creator.id } },
        { credited: true },
      );
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    res.status(400).json({ error: 'Transaction failed' });
    return;
  }

  res.status(201).json({
    message: 'Success',
    payload,
  });
});

export default router;
