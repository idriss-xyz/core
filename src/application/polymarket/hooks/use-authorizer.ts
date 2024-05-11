import { useMutation } from '@tanstack/react-query';
import { createL1Headers } from '@polymarket/clob-client/dist/headers';
import { JsonRpcSigner } from '@ethersproject/providers';
import { useCallback } from 'react';

import { CHAIN } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { GetApiKeyCommand } from '../commands';

export const useAuthorizer = () => {
  const createL1HeadersMutation = useCreateL1HeadersMutation();
  const getApiKeyCommandMutation = useCommandMutation(GetApiKeyCommand);

  const authorize = useCallback(
    async (signer: JsonRpcSigner) => {
      const l1Headers = await createL1HeadersMutation.mutateAsync(signer);
      return getApiKeyCommandMutation.mutateAsync({ headers: l1Headers });
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

const useCreateL1HeadersMutation = () => {
  return useMutation({
    mutationFn: async (signer: JsonRpcSigner) => {
      return createL1Headers(signer, CHAIN.POLYGON.id);
    },
  });
};
