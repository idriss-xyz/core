import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useCommandMutation } from 'shared/messaging';
import { createWalletClient, Wallet } from 'shared/web3';

import { GetApiKeyCommand } from '../commands';
import { buildL1SignaturePayload } from '../utils';

export const useAuthorizer = () => {
  const createL1HeadersMutation = useCreateL1Signature();
  const getApiKeyCommandMutation = useCommandMutation(GetApiKeyCommand);

  const authorize = useCallback(
    async (properties: { wallet: Wallet; timestamp: string }) => {
      const { wallet, timestamp } = properties;
      const l1Signature = await createL1HeadersMutation.mutateAsync({
        wallet,
        timestamp,
      });
      return getApiKeyCommandMutation.mutateAsync({
        headers: {
          POLY_NONCE: '0',
          POLY_ADDRESS: wallet.account,
          POLY_SIGNATURE: l1Signature,
          POLY_TIMESTAMP: timestamp,
        },
      });
    },
    [createL1HeadersMutation, getApiKeyCommandMutation],
  );

  const isAuthorizing =
    createL1HeadersMutation.isPending || getApiKeyCommandMutation.isPending;

  const isFailed =
    createL1HeadersMutation.isError || getApiKeyCommandMutation.isError;

  const reset = useCallback(() => {
    createL1HeadersMutation.reset();
    getApiKeyCommandMutation.reset();
  }, [createL1HeadersMutation, getApiKeyCommandMutation]);

  return { authorize, isAuthorizing, isFailed, reset };
};

const useCreateL1Signature = () => {
  return useMutation({
    mutationFn: async (properties: { wallet: Wallet; timestamp: string }) => {
      const { wallet, timestamp } = properties;
      const walletClient = createWalletClient(wallet);
      return walletClient.signTypedData(
        buildL1SignaturePayload({ address: wallet.account, timestamp }),
      );
    },
  });
};
