import {
  ALCHEMY_NATIVE_TOKENS,
  NETWORK_TO_ALCHEMY,
  NULL_ADDRESS,
  PriceHistoryQuery,
  ZAPPER_API_URL,
} from '../constants';
import { getChainByNetworkName } from './network-utils';

type PriceTick = { timestamp: number; median: number };

const zapperHistoryCache: Record<string, PriceTick[]> = {};

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

export function getOldestZapperPrice(
  tokenAddress: string,
  network: string,
): number | null {
  const zapperCacheKey = `${network}_${tokenAddress}`;
  const priceTicks = zapperHistoryCache[zapperCacheKey];

  if (priceTicks?.length > 0) {
    const oldestTick = priceTicks[priceTicks.length - 1];
    return oldestTick.median;
  }

  return null;
}

export async function getZapperPrice(
  tokenAddress: string,
  network: string,
  txDate: Date,
): Promise<number | null> {
  const zapperCacheKey = `${network}_${tokenAddress}`;
  let priceTicks = zapperHistoryCache[zapperCacheKey];

  // Fetch entire price history if not cached
  if (!priceTicks) {
    try {
      const chain = getChainByNetworkName(network);

      const variables = {
        address: tokenAddress,
        chainId: chain?.id,
        currency: 'USD',
        timeFrame: 'YEAR',
      };

      const encodedKey = Buffer.from(process.env.ZAPPER_API_KEY ?? '').toString(
        'base64',
      );
      const response = await fetch(ZAPPER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedKey}`,
        },
        body: JSON.stringify({
          query: PriceHistoryQuery,
          variables,
        }),
      });

      const json = await response.json();
      priceTicks = json.data?.fungibleTokenV2?.priceData?.priceTicks ?? [];
      zapperHistoryCache[zapperCacheKey] = priceTicks;
    } catch (error) {
      console.error('Zapper price fetch failed:', error);
      return null;
    }
  }

  // Find closest price within 24 hours
  if (priceTicks.length > 0) {
    const closestTick = priceTicks.find((tick) => {
      const tickTime = tick.timestamp * 1000;
      const txTime = txDate.getTime();
      return Math.abs(tickTime - txTime) <= 24 * 60 * 60 * 1000;
    });

    if (closestTick?.median) {
      return closestTick.median;
    }
  }

  return null;
}

export async function getAlchemyPrice(
  tokenAddress: string,
  network: string,
  txDate: Date,
): Promise<number | null> {
  const alchemyNetwork =
    NETWORK_TO_ALCHEMY[network as keyof typeof NETWORK_TO_ALCHEMY];
  if (!alchemyNetwork) return null;

  try {
    return await retryWithBackoff(async () => {
      const startTime = Math.floor(
        new Date(txDate).setHours(0, 0, 0, 0) / 1000,
      );
      const endTime = Math.floor(
        new Date(txDate).setHours(23, 59, 59, 999) / 1000,
      );

      const isNativeToken = tokenAddress === NULL_ADDRESS;
      const options = {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          ...(isNativeToken
            ? {
                symbol:
                  ALCHEMY_NATIVE_TOKENS[
                    network as keyof typeof ALCHEMY_NATIVE_TOKENS
                  ],
              }
            : {
                address: tokenAddress,
                network: alchemyNetwork,
              }),
          startTime,
          endTime,
          interval: '1d',
        }),
      };

      const response = await fetch(
        `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/historical`,
        options,
      );

      const data = await response.json();
      if (data.data?.[0]?.value) {
        const price = Number(data.data[0].value);
        return price;
      }
      return null;
    });
  } catch (error) {
    console.error(
      `Failed to fetch Alchemy price for token ${tokenAddress} on ${network} after retries:`,
      error,
    );
    return null;
  }
}
