import { Request, Response, Router } from 'express';

import { getAddress } from 'viem';

import dotenv from 'dotenv';

import { LAMBDA_CLIENT, LAMBDA_REWARDS } from '../config/aws-config';
import { getAvailableRewards } from '../services/reward-calculating-utils';
import { calculateDollarsInIdrissToken } from '@idriss-xyz/utils';
import {
  buildInvokeCommand,
  decodeLambda,
  getClient,
} from '../utils/drip-utils';
import { base } from 'viem/chains';
import { tightCors } from '../config/cors';
import { verifyToken } from '../middleware/auth.middleware';
import { AppDataSource, Creator, Referral } from '@idriss-xyz/db';

dotenv.config();

const router = Router();

router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const creatorRepository = AppDataSource.getRepository(Creator);
    const creator = await creatorRepository.findOne({
      where: { privyId: req.user.id },
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

    const rewardsToClaim = getAvailableRewards(referrals);

    if (rewardsToClaim === 0) {
      console.error('No rewards to claim');
      res.status(400).json({ error: 'No rewards to claim' });
      return;
    }

    const chain = base;
    const amount = await calculateDollarsInIdrissToken(
      rewardsToClaim,
      chain.id,
    );

    const faucetAddress = getAddress(process.env.FAUCET_ADDRESS || '');
    const client = getClient(chain);
    const nonce = await client.getTransactionCount({
      address: faucetAddress,
      blockTag: 'pending',
    });

    const command = buildInvokeCommand(
      {
        recipient: creator.primaryAddress,
        amount: amount,
        chainId: String(chain.id),
        nonce,
      },
      LAMBDA_REWARDS,
    );

    try {
      const resp = await LAMBDA_CLIENT.send(command);
      if (resp.FunctionError) {
        const details =
          resp.Payload && (resp.Payload as Uint8Array).byteLength
            ? Buffer.from(resp.Payload as Uint8Array).toString('utf8')
            : null;
        res.status(502).json({ error: 'Lambda FunctionError', details });
        return;
      }

      const body = decodeLambda(resp);
      if (body?.error) {
        res.status(502).json({ error: body.error });
        return;
      }

      await referralRepository.update(
        { referrer: { id: creator.id } },
        { credited: true },
      );

      res.status(200).json({ txHash: body.txHash });
    } catch (e: any) {
      res
        .status(500)
        .json({ error: 'Lambda invoke failed', detail: e.message });
    }
  },
);

export default router;
