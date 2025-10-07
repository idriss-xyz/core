import { CREATOR_API_URL, NULL_ADDRESS } from '@idriss-xyz/constants';
import { getAccessToken } from '@privy-io/react-auth';
import { Hex } from 'viem';

export const claimDailyDrip = async (
  chainId: number,
  token?: Hex,
  type?: string,
  tokenId?: bigint | number,
): Promise<Hex | undefined> => {
  try {
    const authToken = await getAccessToken();
    if (!authToken) return;

    const body: Record<string, string> = {
      chainId: String(chainId),
      token: token ?? NULL_ADDRESS,
      type: type ?? 'token',
    };

    if (tokenId !== undefined) body.tokenId = String(tokenId);

    const resp = await fetch(`${CREATOR_API_URL}/drip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) return;
    const { txHash } = await resp.json().catch(() => {
      return {};
    });
    return txHash as Hex | undefined;
  } catch {
    return;
  }
};
