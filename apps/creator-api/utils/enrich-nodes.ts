import { PriceHistoryQuery, ZAPPER_API_URL } from '../constants';
import { ZapperNode } from '../types';
import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../.env.${mode}`) },
);

export async function enrichNodesWithHistoricalPrice(
  edges: { node: ZapperNode }[],
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const priceCache: Record<string, { timestamp: number; median: number }[]> =
    {};

  for (const edge of edges) {
    const node = edge.node;
    if (node.timestamp >= todayTimestamp) continue;

    const tokenItem = node.interpretation.descriptionDisplayItems[0];
    if (!tokenItem?.tokenV2) continue;

    const tokenAddress = tokenItem.tokenV2.address;
    const network = tokenItem.network;
    const cacheKey = `${tokenAddress}_${network}`;

    let priceTicks = priceCache[cacheKey];
    if (!priceTicks) {
      const variables = {
        address: tokenAddress,
        network,
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

      const fetchedTicks: { timestamp: number; median: number }[] =
        json.data?.fungibleToken?.onchainMarketData?.priceTicks ?? [];
      if (fetchedTicks.length === 0) continue;
      priceCache[cacheKey] = fetchedTicks;
      priceTicks = fetchedTicks;
    }

    let closestTick = priceTicks[0];
    let minDiff = Math.abs(node.timestamp - closestTick!.timestamp);
    for (const tick of priceTicks) {
      const diff = Math.abs(node.timestamp - tick.timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestTick = tick;
      } else if (diff > minDiff) {
        break;
      }
    }
    tokenItem.tokenV2.onchainMarketData.price = closestTick!.median;
  }
}
