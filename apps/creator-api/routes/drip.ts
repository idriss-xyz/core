import { Router, Request, Response } from 'express';
import { getAddress, Hex } from 'viem';
import dotenv from 'dotenv';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { verifyToken } from '../db/middleware/auth.middleware';
import { LAMBDA_CLIENT, LAMBDA_FAUCET } from '../config/aws-config';
import { creatorProfileService } from '../services/creator-profile.service';
import {
  buildInvokeCommand,
  calcDripWei,
  chainMap,
  decodeLambda,
  estimateErc20GasOrDefault,
  getClient,
} from '../utils/drip-utils';
import { hasClaimedToday, recordClaim } from '../db/drip-quota';
import { CHAIN_ID_TO_TOKENS } from '@idriss-xyz/constants';
import { tightCors } from '../config/cors';

dotenv.config();

const router = Router();

router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    const { chainId, token } = req.body;
    const checkedTokenAddress = getAddress(token);

    if (!Object.keys(chainMap).includes(String(chainId))) {
      res.status(400).json({ error: 'Unsupported chainId' });
      return;
    }

    const chain = chainMap[String(chainId) as keyof typeof chainMap];
    const allowedTokens = CHAIN_ID_TO_TOKENS[Number(chain.id)]?.map((t) =>
      getAddress(t.address),
    );

    if (
      checkedTokenAddress &&
      (!allowedTokens || !allowedTokens.includes(checkedTokenAddress))
    ) {
      res.status(400).json({ error: 'Unsupported token for this chain' });
      return;
    }

    if (!req.user?.id || !chain) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const creatorRepository = AppDataSource.getRepository(Creator);
    const creator = await creatorRepository.findOne({
      where: { privyId: req.user.id },
    });

    if (!creator) {
      res.status(404).json({ error: 'Creator profile not found' });
      return;
    }

    const fullProfile = await creatorProfileService.getProfileById(creator.id);
    if (!fullProfile?.primaryAddress) {
      res.status(400).json({ error: 'No primary address found' });
      return;
    }

    // daily-per-chain guard (use funding chain for the claim)
    const already = await hasClaimedToday(creator.id, chain.id);
    if (already) {
      res
        .status(429)
        .json({ error: 'Daily drip already claimed for this chain' });
      return;
    }

    const client = getClient(chain);

    const faucetAddress = getAddress(process.env.FAUCET_ADDRESS || '');
    const userAddress = getAddress(fullProfile.primaryAddress);
    const nonce = await client.getTransactionCount({
      address: faucetAddress,
      blockTag: 'pending',
    });

    const gasLimit = await estimateErc20GasOrDefault({
      client,
      token: checkedTokenAddress,
      from: userAddress,
      to: faucetAddress,
    });

    const amountWei = await calcDripWei({ client, gasLimit });

    const cmd = buildInvokeCommand(
      {
        recipient: fullProfile.primaryAddress as Hex,
        amount: amountWei.toString(),
        chainId: String(chain.id),
        nonce,
      },
      LAMBDA_FAUCET,
    );

    try {
      const resp = await LAMBDA_CLIENT.send(cmd);

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

      await recordClaim(creator.id, chain.id);

      res.status(200).json({ txHash: body.txHash });
    } catch (e: any) {
      res
        .status(500)
        .json({ error: 'Lambda invoke failed', detail: e.message });
    }
  },
);

export default router;
