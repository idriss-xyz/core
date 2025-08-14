import { Router, Request, Response } from 'express';
import { Hex, getAddress, createPublicClient, http, parseGwei } from 'viem';
import { sepolia } from 'viem/chains';
import dotenv from 'dotenv';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { verifyToken } from '../db/middleware/auth.middleware';
import { LAMBDA_CLIENT, SIGNING_LAMBDA_NAME } from '../config/aws-config';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { creatorProfileService } from '../services/creator-profile.service';

dotenv.config();

const router = Router();

const chainMap = {
  '11155111': sepolia,
};

// TEMPORARY TEST ENDPOINT, ADD PRECAUTIONS FOR PROD
router.post('/', verifyToken(), async (req: Request, res: Response) => {
  const { chainId } = req.body;

  if (!Object.keys(chainMap).includes(String(chainId))) {
    res.status(400).json({ error: 'Unsupported chainId' });
    return;
  }

  const chain = chainMap[String(chainId) as keyof typeof chainMap];

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

  const client = createPublicClient({
    chain,
    transport: http(process.env.RPC_URL || ''),
  });

  const faucetAddress = getAddress(process.env.FAUCET_ADDRESS || '');
  const nonce = await client.getTransactionCount({ address: faucetAddress });
  const gasPrice = await client.getGasPrice();
  const estimatedGas = BigInt(50000);
  const amount = gasPrice * estimatedGas * BigInt(3);

  const command = new InvokeCommand({
    FunctionName: SIGNING_LAMBDA_NAME,
    Payload: Buffer.from(
      JSON.stringify({
        body: JSON.stringify({
          recipient: fullProfile.primaryAddress,
          amount: amount.toString(),
          chainId: String(chain.id),
          nonce,
        }),
      }),
    ),
  });

  try {
    const resp = await LAMBDA_CLIENT.send(command);

    const payloadStr =
      resp.Payload && (resp.Payload as Uint8Array).byteLength
        ? Buffer.from(resp.Payload as Uint8Array).toString('utf8')
        : '';

    if (resp.FunctionError) {
      res.status(502).json({
        error: 'Lambda FunctionError',
        functionError: resp.FunctionError,
        details: payloadStr || null,
        statusCode: resp.StatusCode,
      });
      return;
    }

    if (!payloadStr) {
      res.status(502).json({
        error: 'No response from lambda',
        statusCode: resp.StatusCode,
      });
      return;
    }

    const outer = JSON.parse(payloadStr); // { statusCode, body }
    const bodyObj =
      typeof outer.body === 'string' ? JSON.parse(outer.body) : outer.body;

    if (bodyObj?.error) {
      res.status(502).json({ error: bodyObj.error });
      return;
    }

    res.status(200).json({ txHash: bodyObj.txHash });
  } catch (e: any) {
    res.status(500).json({ error: 'Lambda invoke failed', detail: e.message });
  }
});

export default router;
