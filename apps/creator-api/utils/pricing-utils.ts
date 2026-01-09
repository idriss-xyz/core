import { formatUnits, zeroAddress } from 'viem';
import {
  ZAPPER_API_URL,
  PriceHistoryQuery,
  ALCHEMY_NATIVE_TOKENS,
  NETWORK_TO_ALCHEMY,
  NATIVE_COIN_ADDRESS,
} from '@idriss-xyz/constants';

import { getChainByNetworkName } from '@idriss-xyz/utils';

type PriceTick = { timestamp: number; median: number };

type ZapperCacheEntry = {
  priceTicks: PriceTick[];
  currentPrice: number | null;
};

type AlchemyPriceResponse = {
  data: { address: string; network: string; prices?: { value: string }[] }[];
};

type OpenSeaBestOfferResponse = {
  price?: { value?: string; currency?: string; decimals?: number };
  protocol_data?: {
    parameters?: {
      consideration?: { startAmount?: string }[];
    };
  };
};

const zapperHistoryCache: Record<string, ZapperCacheEntry> = {};

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

export async function getZapperPrice(
  tokenAddress: string,
  network: string,
  txDate: Date,
): Promise<number | null> {
  const zapperCacheKey = `${network}_${tokenAddress}`;
  const cachedEntry = zapperHistoryCache[zapperCacheKey];

  let priceTicks = cachedEntry?.priceTicks;
  let fallbackPrice = cachedEntry?.currentPrice ?? null;

  // Fetch if not in cache
  if (!cachedEntry) {
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
      priceTicks = json.data?.fungibleTokenV2?.priceData?.priceTicks ?? [];

      zapperHistoryCache[zapperCacheKey] = {
        priceTicks,
        currentPrice: fallbackPrice,
      };
    } catch (error) {
      console.error('Zapper price fetch failed:', error);
      return null;
    }
  }

  // If we have history, search for a relevant price tick
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

  // Fallback to latest price
  return fallbackPrice;
}

async function fetchERC20PricesFromAlchemy<T = unknown>(
  body: object,
): Promise<T> {
  return retryWithBackoff(async () => {
    const response = await fetch(
      `https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_API_KEY}/tokens/by-address`,
      {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    if (!response.ok)
      throw new Error(`Alchemy request failed with status ${response.status}`);
    return (await response.json()) as T;
  });
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
    } catch (error) {
      console.error(`Failed to fetch native price for ${symbol}:`, error);
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
    if (t.address === zeroAddress || t.address === NATIVE_COIN_ADDRESS) {
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
        if (t.address !== zeroAddress && t.address !== NATIVE_COIN_ADDRESS)
          continue;

        const sym =
          ALCHEMY_NATIVE_TOKENS[
            t.network as keyof typeof ALCHEMY_NATIVE_TOKENS
          ];
        const price = sym ? nativePrices[sym] : undefined;

        if (price !== undefined) {
          result[`${t.network}:${zeroAddress}`] = price;
          result[`${t.network}:${NATIVE_COIN_ADDRESS}`] = price;
        }
      }
    } catch (error) {
      console.error('Failed to fetch native prices from Alchemy:', error);
    }
  }

  // erc20
  if (erc20Addresses.length > 0) {
    try {
      const data = await fetchERC20PricesFromAlchemy<AlchemyPriceResponse>({
        addresses: erc20Addresses,
      });
      for (const priceInfo of data.data || []) {
        const net = Object.keys(NETWORK_TO_ALCHEMY).find((n) => {
          return (
            NETWORK_TO_ALCHEMY[n as keyof typeof NETWORK_TO_ALCHEMY] ===
            priceInfo.network
          );
        });
        const address = priceInfo.address;
        const price = priceInfo.prices?.[0]?.value;
        if (net && address && price) {
          result[`${net}:${address.toLowerCase()}`] = Number(price);
        }
      }
    } catch (error) {
      console.error('Failed to fetch ERC20 prices from Alchemy:', error);
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
