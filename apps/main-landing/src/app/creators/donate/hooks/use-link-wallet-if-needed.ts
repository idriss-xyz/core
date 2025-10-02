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
  donorName?: string,
) {
  const switchChain = useSwitchChain();

  return useCallback(async () => {
    if (!walletClient?.account?.address) return;

    const savedChoice = localStorage.getItem('donate-option-choice');

    const address = getAddress(walletClient.account.address);

    const authToken = await getAccessToken();
    console.log('authToken', authToken); // TODO: Remove

    // 1) check if address is linked
    const qs = new URLSearchParams({ address });
    const linkedResult = await fetch(`${CREATOR_API_URL}/siwe/linked?${qs}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const { linkedTo } = await linkedResult.json();
    console.log('linkedTo', linkedTo); // TODO: Remove

    if (savedChoice === 'account' && donorName) {
      // Wallet is already linked to another (not donor's) public account
      if (linkedTo && linkedTo !== donorName) {
        console.error('Wallet already linked to another account', linkedTo);
        throw new Error('This wallet is already linked to a public account.');
      }
      // Wallet is already linked to the donor account
      else if (linkedTo) return;

      // Wallet is not linked to any account, link to current
      // 2) get nonce
      const nonceResult = await fetch(`${CREATOR_API_URL}/siwe/nonce`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const { nonce } = await nonceResult.json();
      console.log('nonce', nonce); // TODO: Remove

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
      console.log('message', message); // TODO: Remove

      await switchChain.mutateAsync({
        walletClient,
        chainId,
      });
      console.log('switchChain.mutateAsync done'); // TODO: Remove

      const signature = await walletClient.signMessage({
        account: address,
        message,
      });
      console.log('signature', signature); // TODO: Remove

      // 4) verify
      const verifyResult = await fetch(`${CREATOR_API_URL}/siwe/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message, signature }),
      });
      const verifyResultJson = await verifyResult.json();
      console.log('verifyResultJson', verifyResultJson); // TODO: Remove
      if (!verifyResult.ok) throw new Error('Error verifying signature');
    } else if ((savedChoice === 'guest' || !savedChoice) && linkedTo) {
      throw new Error('This wallet is already linked to a public account.');
    }
  }, [walletClient, chainId, donorName, switchChain]);
}
