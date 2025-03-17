import { createPublicClient, GetEnsAvatarReturnType, http } from 'viem';
import { mainnet } from 'viem/chains';
import { NextResponse } from 'next/server';
import { normalize } from 'viem/ens';

interface ApiResponse {
  error?: string;
  image?: GetEnsAvatarReturnType;
}

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
});

// ts-unused-exports:disable-next-line
export async function GET(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  const url = new URL(request.url);
  const ensDomain = url.searchParams.get('ens');
  if (!ensDomain)
    return NextResponse.json({ error: 'Domain not provided', status: 400 });
  try {
    const avatar_url = await client.getEnsAvatar({
      name: normalize(ensDomain),
    });

    return NextResponse.json({ image: avatar_url });
  } catch (error) {
    console.error('[ERROR] Failed fetching or saving stake events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 400 },
    );
  }
}
