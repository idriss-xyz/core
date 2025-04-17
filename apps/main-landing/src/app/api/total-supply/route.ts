import { NextResponse } from 'next/server';

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
};

const TOTAL_SUPPLY = 1_000_000_000n;

// ts-unused-exports:disable-next-line
export function GET() {
  try {
    return NextResponse.json(
      { result: TOTAL_SUPPLY.toString() },
      { status: 200, headers: DEFAULT_HEADERS },
    );
  } catch (error) {
    console.error('[ERROR] Failed fetching balances:', error);

    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500, headers: DEFAULT_HEADERS },
    );
  }
}
