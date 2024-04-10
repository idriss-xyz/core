import { useMutation } from '@tanstack/react-query';
import { createL1Headers } from '@polymarket/clob-client/dist/headers';
import { JsonRpcSigner } from '@ethersproject/providers';

import { CHAIN } from 'shared/web3';

import { GetApiKeyResponse, L1Headers } from '../../polymarket.types';
import { GetApiKeyCommand } from '../../commands';

const getApiKey = async (l1Headers: L1Headers) => {
  const command = new GetApiKeyCommand({ headers: l1Headers });
  return command.send<GetApiKeyResponse>();
};

export const useRequestAuth = () => {
  return useMutation({
    mutationFn: async (signer: JsonRpcSigner) => {
      const l1Headers = await createL1Headers(signer, CHAIN.POLYGON.id);
      return getApiKey(l1Headers);
    },
  });
};
