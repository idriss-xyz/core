import { formatUnits, zeroAddress } from 'viem';
import {
  ZAPPER_API_URL,
  PriceHistoryQuery,
  ALCHEMY_NATIVE_TOKENS,
  NETWORK_TO_ALCHEMY,
} from '@idriss-xyz/constants';

import { getChainByNetworkName } from '@idriss-xyz/utils';

type PriceTick = { timestamp: number; median: number };

type OpenSeaBestOfferResponse = {
  price?: { value?: string; currency?: string; decimals?: number };
  protocol_data?: {
    parameters?: {
      consideration?: { startAmount?: string }[];
    };
  };
};

const zapperHistoryCache: Record<string, PriceTick[]> = {};

async function retryWithBackoff<T>(
  function_: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<T> {
  for (let index = 0; index < maxRetries; index++) {
    try {
      return await function_();
    } catch (error) {
      if (index === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, index);
      await new Promise((resolve) => {
        return setTimeout(resolve, delay);
      });
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

  if (priceTicks && priceTicks?.length > 0) {
    const oldestTick = priceTicks.at(-1);
    return oldestTick!.median;
  }

  return null;
}

export async function getZapperPrice(
  tokenAddress: string,
  network: string,
  txDate: Date,
): Promise<number | null> {
  const zapperCacheKey = `${network}_${tokenAddress}`;
  const priceTicks = zapperHistoryCache[zapperCacheKey];
  let fallbackPrice: number | null = null;

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

      const json = (await response.json()) as {
        data?: {
          fungibleTokenV2?: {
            priceData?: { price?: number; priceTicks?: PriceTick[] };
          };
        };
      };
      fallbackPrice = json.data?.fungibleTokenV2?.priceData?.price ?? null;
      zapperHistoryCache[zapperCacheKey] =
        json.data?.fungibleTokenV2?.priceData?.priceTicks ?? [];
    } catch (error) {
      console.error('Zapper price fetch failed:', error);
      return null;
    }
  }
  // Find closest price within 24 hours
  if (priceTicks && priceTicks.length > 0) {
    const closestTick = priceTicks.find((tick) => {
      const tickTime =
        tick.timestamp > 1e12 ? tick.timestamp : tick.timestamp * 1000;
      const txTime = txDate.getTime();
      return Math.abs(tickTime - txTime) <= 24 * 60 * 60 * 1000;
    });

    if (closestTick?.median) {
      return closestTick.median;
    }
  }

  return fallbackPrice;
}

export async function getAlchemyHistoricalPrice(
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

      const isNativeToken = tokenAddress === zeroAddress;
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

      const data = (await response.json()) as {
        data?: { value?: string }[];
      };
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

async function fetchNativePricesFromAlchemy(
  symbols: string[],
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  if (symbols.length === 0) return result;

  const uniqueSymbols = [...new Set(symbols)];

  for (const symbol of uniqueSymbols) {
    try {
      const response = await fetch(
        `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-symbol?symbols=${symbol}`,
        {
          method: 'GET',
          headers: { accept: 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Alchemy symbol request failed for ${symbol}: ${response.status}`,
        );
      }

      const json = (await response.json()) as {
        data?: { prices?: { value?: string }[]; symbol?: string }[];
      };
      const entry = json.data?.[0];
      const price = entry?.prices?.[0]?.value;
      if (entry?.symbol && price) {
        result[entry.symbol] = Number(price);
      }
    } catch (err) {
      console.error(`Failed to fetch native price for ${symbol}:`, err);
    }
  }

  return result;
}

type BestOffer = {
  price: string;
  currency: string;
  usdValue?: number;
};

export async function fetchNftFloorFromOpensea(
  collectionSlug: string,
  tokenId: string,
): Promise<BestOffer | null> {
  try {
    const url = new URL(
      `https://api.opensea.io/api/v2/offers/collection/${collectionSlug}/nfts/${tokenId}/best`,
    );

    const resp = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': process.env.OPENSEA_API_KEY ?? '',
        'accept': 'application/json',
      },
    });

    if (!resp.ok) {
      console.error(
        `OpenSea HTTP ${resp.status} for ${collectionSlug}/${tokenId}`,
        await resp.text(),
      );
      return null;
    }

    const json = (await resp.json()) as OpenSeaBestOfferResponse;
    const offer = json.price;
    if (!offer) return null;

    const rawPrice = offer?.value ?? '0';
    const currency = offer?.currency ?? 'WETH';

    // normalize price per-item if ERC1155 bundle
    let perUnitRaw = BigInt(rawPrice);
    const consideration = json.protocol_data?.parameters?.consideration?.[0];
    const amount = consideration?.startAmount
      ? BigInt(consideration.startAmount)
      : BigInt(1);

    if (amount > BigInt(1)) {
      perUnitRaw = perUnitRaw / amount;
    }

    let usdValue: number | undefined;
    if (currency.toUpperCase() === 'WETH' || currency.toUpperCase() === 'ETH') {
      const prices = await fetchNativePricesFromAlchemy(['ETH']);
      const ethPrice = prices.ETH;
      if (ethPrice) {
        const ethAmount = Number.parseFloat(
          formatUnits(perUnitRaw, offer?.decimals ?? 18),
        );
        usdValue = ethAmount * ethPrice;
      }
    }

    return { price: perUnitRaw.toString(), currency, usdValue };
  } catch (error) {
    console.error(
      `Failed to fetch OpenSea floor for ${collectionSlug}/${tokenId}:`,
      error,
    );
    return null;
  }
}
