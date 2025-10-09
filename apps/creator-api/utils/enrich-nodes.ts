import { ZapperNode } from '../types';
import { isTokenItem } from './zapper-type-guards';
import {
  getZapperPrice,
  getAlchemyHistoricalPrice,
  getOldestZapperPrice,
} from './price-fetchers';

export async function enrichNodesWithHistoricalPrice(
  edges: { node: ZapperNode }[],
): Promise<void> {
  const priceCache: Record<string, number> = {};

  for (const edge of edges) {
    const node = edge.node;
    const items = node.interpretation.descriptionDisplayItems;
    const tokenItem = items.find(isTokenItem);
    if (!tokenItem) continue;

    const txDate = new Date(node.timestamp);
    const today = new Date();
    const isToday = txDate.toDateString() === today.toDateString();

    if (isToday && tokenItem.tokenV2.priceData?.price) {
      continue;
    }

    const dateStr = txDate.toISOString().split('T')[0];
    const cacheKey = `${tokenItem.network}_${tokenItem.tokenV2.address}_${dateStr}`;

    if (priceCache[cacheKey] !== undefined) {
      tokenItem.tokenV2.priceData.price = priceCache[cacheKey];
      continue;
    }

    const zapperPrice = await getZapperPrice(
      tokenItem.tokenV2.address,
      tokenItem.network,
      txDate,
    );

    if (zapperPrice !== null) {
      priceCache[cacheKey] = zapperPrice;
      tokenItem.tokenV2.priceData.price = zapperPrice;
      continue;
    }

    const alchemyPrice = await getAlchemyHistoricalPrice(
      tokenItem.tokenV2.address,
      tokenItem.network,
      txDate,
    );

    if (alchemyPrice !== null) {
      priceCache[cacheKey] = alchemyPrice;
      tokenItem.tokenV2.priceData.price = alchemyPrice;
    } else {
      const fallbackPrice = getOldestZapperPrice(
        tokenItem.tokenV2.address,
        tokenItem.network,
      );
      if (fallbackPrice) {
        priceCache[cacheKey] = fallbackPrice;
        tokenItem.tokenV2.priceData.price = fallbackPrice;
      }
    }
  }
}
