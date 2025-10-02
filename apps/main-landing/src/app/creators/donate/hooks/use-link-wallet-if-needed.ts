import { useCallback } from 'react';
import { getAccessToken } from '@privy-io/react-auth';
import { getAddress } from 'viem';
import { SiweMessage } from 'siwe';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import type { UseWalletClientReturnType } from 'wagmi';

type WalletClient = NonNullable<UseWalletClientReturnType['data']>;

export function useLinkWalletIfNeeded(
  walletClient: WalletClient | undefined,
  chainId: number,
  donorName?: string,
) {
  return useCallback(async () => {
    if (!walletClient?.account?.address) return;

    const authToken = await getAccessToken();
    const address = getAddress(walletClient.account.address);

    // 1) check
    const qs = new URLSearchParams({ address });
    const linkedResult = await fetch(`${CREATOR_API_URL}/siwe/linked?${qs}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const { linkedTo } = await linkedResult.json();
    // Wallet is already linked to another (not donor's) public account
    if (linkedTo && linkedTo !== donorName) {
      console.error('Wallet already linked to another account', linkedTo);
      throw new Error('This wallet is already linked to a public account.');
    }
    // Wallet is already linked to the donor account
    else if (linkedTo) return;

    // Wallet is not linked to any account, link to current
    // 2) nonce
    const nonceResult = await fetch(`${CREATOR_API_URL}/siwe/nonce`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const { nonce } = await nonceResult.json();

    // 3) sign SIWE
    const message_ = new SiweMessage({
      domain: window.location.hostname,
      address,
      statement:
        'Sign to confirm this wallet is yours and link it to your IDRISS Creators account. This is a one-time free signature.',
      uri: window.location.origin,
      version: '1',
      chainId,
      nonce,
    });
    const message = message_.prepareMessage();
    const signature = await walletClient.signMessage({
      account: address,
      message,
    });

    // 4) verify
    const verifyResult = await fetch(`${CREATOR_API_URL}/siwe/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ message, signature }),
    });
    if (!verifyResult.ok) throw new Error('SIWE verify failed');
  }, [walletClient, chainId, donorName]);
}
