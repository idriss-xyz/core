import { Router, Request, Response } from 'express';
import { getAddress, Hex } from 'viem';
import {
  CHAIN_ID_TO_NFT_COLLECTIONS,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import dotenv from 'dotenv';
import { AppDataSource } from '@idriss-xyz/db';
import { Creator } from '@idriss-xyz/db';
import { LAMBDA_CLIENT, LAMBDA_FAUCET } from '../config/aws-config';
import { creatorProfileService } from '../services/creator-profile.service';
import {
  buildInvokeCommand,
  calcDripWei,
  chainMap,
  decodeLambda,
  estimateErc20GasOrDefault,
  estimateNftGasOrDefault,
  getClient,
} from '../utils/drip-utils';
import { hasClaimedToday, recordClaim } from '@idriss-xyz/db';
import { CHAIN_ID_TO_TOKENS } from '@idriss-xyz/constants';
import { tightCors } from '../config/cors';
import { verifyToken } from '../middleware/auth.middleware';

dotenv.config();

const router = Router();

router.post(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    const { chainId, token, type, tokenId } = req.body;

    const tokenParam: string = typeof token === 'string' ? token : NULL_ADDRESS;
    const isNft = type && ['erc721', 'erc1155'].includes(type);

    let checkedTokenAddress: Hex;
    try {
      checkedTokenAddress = getAddress(tokenParam);
    } catch {
      res.status(400).json({ error: 'Invalid token address' });
      return;
    }

    if (!Object.keys(chainMap).includes(String(chainId))) {
      res.status(400).json({ error: 'Unsupported chainId' });
      return;
    }

    const chain = chainMap[String(chainId) as keyof typeof chainMap];
    let allowedTokens: `0x${string}`[] = [];
    try {
      const allowedErc20Tokens = CHAIN_ID_TO_TOKENS[Number(chain.id)]?.map(
        (t) => getAddress(t.address),
      );
      const allowedNftTokens = CHAIN_ID_TO_NFT_COLLECTIONS[
        Number(chain.id)
      ]?.map((t) => getAddress(t.address));
      allowedTokens = [...allowedErc20Tokens, ...allowedNftTokens];
    } catch {
      res.status(400).json({ error: 'Error parsing allowed tokens' });
      return;
    }

    const parsedTokenId = tokenId !== undefined ? BigInt(tokenId) : BigInt(1);

    if (
      tokenParam !== NULL_ADDRESS &&
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

    let client;
    try {
      client = getClient(chain);
    } catch {
      res.status(400).json({ error: 'Could not get client for chain' });
      return;
    }

    let faucetAddress: Hex, userAddress: Hex;
    try {
      faucetAddress = getAddress(process.env.FAUCET_ADDRESS || '');
      userAddress = getAddress(fullProfile.primaryAddress);
    } catch {
      res.status(400).json({ error: 'Invalid faucet or user address' });
      return;
    }

    const nonce = await client.getTransactionCount({
      address: faucetAddress,
      blockTag: 'pending',
    });

    const gasLimit = isNft
      ? await estimateNftGasOrDefault({
          client,
          token: checkedTokenAddress,
          from: userAddress,
          to: faucetAddress,
          tokenId: parsedTokenId,
        })
      : await estimateErc20GasOrDefault({
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
