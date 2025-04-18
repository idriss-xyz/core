import { ZapperNode } from '../types';
import {
  getZapperPrice,
  getAlchemyPrice,
  getOldestZapperPrice,
} from './price-fetchers';

export async function enrichNodesWithHistoricalPrice(
  edges: { node: ZapperNode }[],
): Promise<void> {
  const priceCache: Record<string, number> = {};

  for (const edge of edges) {
    const node = edge.node;
    const tokenItem = node.interpretation.descriptionDisplayItems[0];
    if (!tokenItem?.tokenV2) continue;

    const txDate = new Date(node.timestamp);
    const today = new Date();
    const isToday = txDate.toDateString() === today.toDateString();

    if (isToday && tokenItem.tokenV2.onchainMarketData?.price) {
      continue;
    }

    const dateStr = txDate.toISOString().split('T')[0];
    const cacheKey = `${tokenItem.network}_${tokenItem.tokenV2.address}_${dateStr}`;

    if (priceCache[cacheKey] !== undefined) {
      tokenItem.tokenV2.onchainMarketData.price = priceCache[cacheKey];
      continue;
    }

    const zapperPrice = await getZapperPrice(
      tokenItem.tokenV2.address,
      tokenItem.network,
      txDate,
    );

    if (zapperPrice !== null) {
      priceCache[cacheKey] = zapperPrice;
      tokenItem.tokenV2.onchainMarketData.price = zapperPrice;
      continue;
    }

    const alchemyPrice = await getAlchemyPrice(
      tokenItem.tokenV2.address,
      tokenItem.network,
      txDate,
    );

    if (alchemyPrice !== null) {
      priceCache[cacheKey] = alchemyPrice;
      tokenItem.tokenV2.onchainMarketData.price = alchemyPrice;
    } else {
      const fallbackPrice = getOldestZapperPrice(
        tokenItem.tokenV2.address,
        tokenItem.network,
      );
      if (fallbackPrice) {
        priceCache[cacheKey] = fallbackPrice;
        tokenItem.tokenV2.onchainMarketData.price = fallbackPrice;
      }
    }
  }
}
