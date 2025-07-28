import { Router, Request, Response } from 'express';

import { Hex } from 'viem';

import dotenv from 'dotenv';
import { AppDataSource } from '../db/database';
import { Creator, Referral } from '../db/entities';
import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda';

dotenv.config();

const router = Router();

router.post('/:address', async (req: Request, res: Response) => {
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
    throw new Error('Creator with given address does not exist');
  }

  const referralRepository = AppDataSource.getRepository(Referral);

  const referrals = await referralRepository.find({
    where: { referrer: { id: creator.id }, credited: false },
    relations: ['referrer'],
  });

  if (referrals.length > 0) {
    console.error('No referrals to claim');
    throw new Error('No referrals to claim');
  }

  const rewardsToClaim = referrals
    .filter((referral) => !referral.credited)
    .reduce((sum, referral) => sum + referral.reward, 0);

  if (rewardsToClaim === 0) {
    console.error('No rewards to claim');
    throw new Error('No rewards to claim');
  }

  const lambdaName = process.env.LAMDBA_NAME!;
  const region = process.env.AWS_REGION!; // your Lambda region

  // Calculate unsigned transaction hash
  const txHash =
    '0xa3f4c51234abcdef5678deadbeef9abc1234567890fedcba9876543210abcdef0'; // your digest

  const client = new LambdaClient({ region }); // uses defaultProvider() internally

  const command = new InvokeCommand({
    FunctionName: lambdaName, // or full ARN
    Payload: Buffer.from(JSON.stringify({ txHash }))  });

  let payload;

  try {
    const response = await client.send(command);

    payload = response.Payload
      ? JSON.parse(new TextDecoder().decode(response.Payload))
      : null;

    if (!payload) {
      console.error('Payload is null');
      throw new Error('Transaction failed');
    }
  } catch (err) {
    console.error('Lambda invoke error:', err);
    throw new Error('Transaction failed');
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
    throw new Error('Transaction failed');
  }

  res.status(201).json({
    message: 'Success',
    payload,
  });
});

export default router;
