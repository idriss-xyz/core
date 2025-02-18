import { PriceHistoryQuery, ZAPPER_API_URL } from '../../constants';
import { PriceTick } from '../../types';
import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../../utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

export async function fetchHistoricalPriceTicks(
  tokenAddress: string,
  network: string,
  currency = 'USD',
  timeFrame = 'YEAR',
): Promise<PriceTick[]> {
  const variables = {
    address: tokenAddress,
    network,
    currency,
    timeFrame,
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
  const priceTicks: PriceTick[] =
    json.data?.fungibleToken?.onchainMarketData?.priceTicks ?? [];
  return priceTicks;
}
