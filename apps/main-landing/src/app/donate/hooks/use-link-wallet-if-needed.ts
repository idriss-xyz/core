import { useCallback } from 'react';
import { getAccessToken } from '@privy-io/react-auth';
import { getAddress } from 'viem';
import { SiweMessage } from 'siwe';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import type { UseWalletClientReturnType } from 'wagmi';

import { useSwitchChain } from './use-switch-chain';

type WalletClient = NonNullable<UseWalletClientReturnType['data']>;

export function useLinkWalletIfNeeded(
  walletClient: WalletClient | undefined,
  chainId: number,
  setSubmitError: (error: string) => void,
  donorName?: string,
) {
  const switchChain = useSwitchChain();

  return useCallback(async () => {
    if (!walletClient?.account?.address) return;

    const savedChoice = localStorage.getItem('donate-option-choice');

    const address = getAddress(walletClient.account.address);

    // 1) check if address is linked
    const qs = new URLSearchParams({ address });
    const linkedResult = await fetch(`${CREATOR_API_URL}/siwe/linked?${qs}`);
    const { linkedTo } = await linkedResult.json();

    if (savedChoice === 'account' && donorName) {
      // Wallet is already linked to another (not donor's) public account
      if (linkedTo && linkedTo !== donorName) {
        setSubmitError('This wallet is already linked to a public account.');
        throw new Error('This wallet is already linked to a public account.');
      }
      // Wallet is already linked to the donor account
      else if (linkedTo) return;

      const authToken = await getAccessToken();

      // Wallet is not linked to any account, link to current
      // 2) get nonce
      const nonceResult = await fetch(`${CREATOR_API_URL}/siwe/nonce`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const { nonce } = await nonceResult.json();

      // 3) sign SIWE
      const message_ = new SiweMessage({
        domain: window.location.hostname,
        address,
        statement: `Sign to confirm this wallet is yours and link it to your IDRISS account. This is a one-time free signature. By signing, you agree to our Terms of service (https://idriss.xyz/tos) & Privacy policy (https://idriss.xyz/pp).`,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });
      const message = message_.prepareMessage();

      await switchChain.mutateAsync({
        walletClient,
        chainId,
      });

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
      if (!verifyResult.ok) throw new Error('Error verifying signature');
    } else if ((savedChoice === 'guest' || !savedChoice) && linkedTo) {
      setSubmitError('This wallet is already linked to a public account.');
      throw new Error('This wallet is already linked to a public account.');
    }
  }, [walletClient, chainId, donorName, switchChain, setSubmitError]);
}
