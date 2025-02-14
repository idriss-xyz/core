import { NextRequest, NextResponse } from 'next/server';

import { TipHistoryQuery } from './constants';

const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql';
const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing address' },
        { status: 400 },
      );
    }

    const variables = {
      addresses: [address],
      isSigner: false,
    };

    const encodedKey = Buffer.from(ZAPPER_API_KEY ?? '').toString('base64');

    const response = await fetch(ZAPPER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedKey}`,
      },
      body: JSON.stringify({
        query: TipHistoryQuery,
        variables,
      }),
    });
    console.log(response);

    const data = await response.json();
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tip history' },
      { status: 500 },
    );
  }
}
