import { ZapperNode } from '../types';
import dotenv from 'dotenv';
import { join } from 'path';
import { mode } from '../utils/mode';
import { getZapperPrice, getAlchemyPrice } from './price-fetchers';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../.env.${mode}`) },
);

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
    }
  }
}
