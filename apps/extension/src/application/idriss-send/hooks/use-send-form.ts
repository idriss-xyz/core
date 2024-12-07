import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCallback, useMemo } from 'react';

import { CHAIN_ID_TO_TOKENS } from 'shared/web3';

import { SendPayload, createSendPayloadSchema } from '../schema';
import { getDefaultTokenForChainId, getSendFormDefaultValues } from '../utils';

interface Properties {
  allowedChainsIds: number[];
}

export const useSendForm = ({ allowedChainsIds }: Properties) => {
  const formMethods = useForm<SendPayload>({
    defaultValues: getSendFormDefaultValues(allowedChainsIds),
    resolver: zodResolver(createSendPayloadSchema(allowedChainsIds)),
  });

  const [chainId, amount, tokenAddress] = formMethods.watch([
    'chainId',
    'amount',
    'tokenAddress',
  ]);

  const onChangeChainId = useCallback(
    (chainId: number) => {
      formMethods.resetField('tokenAddress', {
        defaultValue: getDefaultTokenForChainId(chainId).address,
      });
    },
    [formMethods],
  );

  const selectedToken = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
      return token.address === tokenAddress;
    });
  }, [chainId, tokenAddress]);

  return { formMethods, chainId, amount, selectedToken, onChangeChainId };
};
