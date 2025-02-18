import { TipHistoryQuery, ZAPPER_API_URL } from '../../constants';
import { TipHistoryVariables, ZapperResponse } from '../../types';

import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../../utils/mode';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../../.env.${mode}`) },
);

export async function fetchTransactions(
  variables: TipHistoryVariables,
): Promise<ZapperResponse> {
  const encodedKey = Buffer.from(process.env.ZAPPER_API_KEY ?? '').toString(
    'base64',
  );
  const response = await fetch(ZAPPER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedKey}`,
    },
    body: JSON.stringify({ query: TipHistoryQuery, variables }),
  });
  const data: ZapperResponse = await response.json();
  return data;
}
