import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
});

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (origin?.endsWith('.ext-twitch.tv')) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  const url = new URL(request.url);
  const ensDomain = url.searchParams.get('ens');

  if (!ensDomain) {
    return NextResponse.json(
      { error: 'Domain not provided' },
      { status: 400, headers },
    );
  }

  try {
    const avatar_url = await client.getEnsAvatar({
      name: normalize(ensDomain),
    });
    return NextResponse.json({ image: avatar_url }, { status: 200, headers });
  } catch (error) {
    console.error('[ERROR] Failed fetching avatar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500, headers },
    );
  }
}
