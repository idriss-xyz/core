import { getChainByNetworkName } from '@idriss-xyz/utils';
import {
  ALCHEMY_NATIVE_TOKENS,
  NETWORK_TO_ALCHEMY,
  PriceHistoryQuery,
  ZAPPER_API_URL,
} from '../constants';

import { NATIVE_COIN_ADDRESS, NULL_ADDRESS } from '@idriss-xyz/constants';
import { formatUnits } from 'viem';

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

      const json = await response.json();
      fallbackPrice = json.data?.fungibleTokenV2?.priceData?.price ?? null;
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

async function fetchERC20PricesFromAlchemy(body: object) {
  return retryWithBackoff(() =>
    fetch(
      `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-address`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`Alchemy request failed with status ${res.status}`);
      }
      return res.json();
    }),
  );
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

      const json = await response.json();
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

export async function getAlchemyPrices(
  tokens: { address: string; network: string }[],
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  if (tokens.length === 0) return result;

  const nativeSymbols: string[] = [];
  const erc20Addresses: { address: string; network: string }[] = [];

  for (const t of tokens) {
    if (t.address === NULL_ADDRESS || t.address === NATIVE_COIN_ADDRESS) {
      const sym =
        ALCHEMY_NATIVE_TOKENS[t.network as keyof typeof ALCHEMY_NATIVE_TOKENS];
      if (sym) nativeSymbols.push(sym);
    } else {
      const alchemyNetwork =
        NETWORK_TO_ALCHEMY[t.network as keyof typeof NETWORK_TO_ALCHEMY];
      if (alchemyNetwork) {
        erc20Addresses.push({ address: t.address, network: alchemyNetwork });
      }
    }
  }

  // native
  if (nativeSymbols.length > 0) {
    try {
      const nativePrices = await fetchNativePricesFromAlchemy(nativeSymbols);
      for (const t of tokens) {
        if (t.address !== NULL_ADDRESS && t.address !== NATIVE_COIN_ADDRESS)
          continue;
        const sym =
          ALCHEMY_NATIVE_TOKENS[
            t.network as keyof typeof ALCHEMY_NATIVE_TOKENS
          ];
        const price = sym ? nativePrices[sym] : undefined;

        if (price !== undefined) {
          result[`${t.network}:${NULL_ADDRESS}`] = price;
          result[`${t.network}:${NATIVE_COIN_ADDRESS}`] = price;
        }
      }
    } catch (err) {
      console.error('Failed to fetch native prices from Alchemy:', err);
    }
  }

  // erc20
  if (erc20Addresses.length > 0) {
    try {
      const data = await fetchERC20PricesFromAlchemy({
        addresses: erc20Addresses,
      });
      for (const priceInfo of data.data || []) {
        const net = Object.keys(NETWORK_TO_ALCHEMY).find(
          (n) =>
            NETWORK_TO_ALCHEMY[n as keyof typeof NETWORK_TO_ALCHEMY] ===
            priceInfo.network,
        );
        const address = priceInfo.address;
        const price = priceInfo.prices?.[0]?.value;
        if (net && address && price) {
          result[`${net}:${address.toLowerCase()}`] = Number(price);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ERC20 prices from Alchemy:', err);
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

    const json = await resp.json();
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
      const ethPrice = prices['ETH'];
      if (ethPrice) {
        const ethAmount = parseFloat(formatUnits(perUnitRaw, offer?.decimals));
        usdValue = ethAmount * ethPrice;
      }
    }

    return { price: perUnitRaw.toString(), currency, usdValue };
  } catch (err) {
    console.error(
      `Failed to fetch OpenSea floor for ${collectionSlug}/${tokenId}:`,
      err,
    );
    return null;
  }
}
