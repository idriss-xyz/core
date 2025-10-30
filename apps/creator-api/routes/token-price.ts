import { Router, Request, Response } from 'express';
import { CHAIN_ID_TO_TOKENS } from '@idriss-xyz/constants';
import { getNetworkKeyByChainId } from '@idriss-xyz/utils';
import { getAlchemyPrices, getZapperPrice } from '../utils/pricing-utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { buyToken, network } = req.query as {
    buyToken?: string;
    network?: string;
  };

  if (!buyToken || !network) {
    res.status(400).json({ error: 'Missing required parameters' });
    return;
  }

  const chainId = Number(network);
  const tokenExists = CHAIN_ID_TO_TOKENS[chainId]?.some(
    (t) => t.address.toLowerCase() === buyToken.toLowerCase(),
  );

  if (!tokenExists) {
    res.status(400).json({ error: 'Token not supported on this network' });
    return;
  }

  try {
    const network_key = getNetworkKeyByChainId(Number(network));
    if (!network_key) {
      res.status(400).json({ error: 'Network not supported' });
      return;
    }

    const key = `${network_key}:${buyToken.toLowerCase()}`;
    let prices: Record<string, number> = {};

    try {
      prices = await getAlchemyPrices([
        { address: buyToken, network: network_key },
      ]);
    } catch (error) {
      console.error('Failed to fetch Alchemy prices:', error);
    }

    let buyUsd = prices[key];
    if (buyUsd === undefined) {
      buyUsd = (await getZapperPrice(buyToken, network_key, new Date())) ?? 0;
    }

    if (!buyUsd || buyUsd === 0) {
      res.status(502).json({ error: 'Price unavailable' });
      return;
    }

    res.json({ price: buyUsd.toString() });
  } catch (error) {
    console.error('Get token price error:', error);
    res.status(500).json({ error: 'Failed to fetch token price' });
  }
});

export default router;
