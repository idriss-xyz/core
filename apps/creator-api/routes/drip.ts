import { Router, Request, Response } from 'express';
import { getAddress } from 'viem';
import dotenv from 'dotenv';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { verifyToken } from '../db/middleware/auth.middleware';
import { LAMBDA_CLIENT } from '../config/aws-config';
import { creatorProfileService } from '../services/creator-profile.service';
import {
  buildInvokeCommand,
  calcDripWei,
  chainMap,
  decodeLambda,
  estimateErc20GasOrDefault,
  getClient,
} from '../utils/drip-utils';

dotenv.config();

const router = Router();

// TEMPORARY TEST ENDPOINT, ADD PRECAUTIONS FOR PROD
router.post('/', verifyToken(), async (req: Request, res: Response) => {
  const { chainId, token } = req.body;

  if (!Object.keys(chainMap).includes(String(chainId))) {
    res.status(400).json({ error: 'Unsupported chainId' });
    return;
  }

  const chain = chainMap[String(chainId) as keyof typeof chainMap];
  const chainTest = chainMap[String(11155111) as keyof typeof chainMap];

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

  const client = getClient(chain);
  const clinetTest = getClient(chainTest);

  const faucetAddress = getAddress(process.env.FAUCET_ADDRESS || '');
  const userAddress = getAddress(fullProfile.primaryAddress);
  const nonce = await clinetTest.getTransactionCount({
    address: faucetAddress,
    blockTag: 'pending',
  });

  const gasLimit = await estimateErc20GasOrDefault({
    client,
    token,
    from: userAddress,
    to: faucetAddress,
  });

  const amountWei = await calcDripWei({ client, gasLimit });

  const cmd = buildInvokeCommand({
    recipient: fullProfile.primaryAddress,
    amount: amountWei.toString(),
    // chainId: String(chain.id),
    chainId: '11155111',
    nonce,
  });

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

    res.status(200).json({ txHash: body.txHash });
  } catch (e: any) {
    res.status(500).json({ error: 'Lambda invoke failed', detail: e.message });
  }
});

export default router;
