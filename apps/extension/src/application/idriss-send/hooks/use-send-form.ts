import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Hex } from 'viem';

import { CHAIN_ID_TO_TOKENS } from 'shared/web3';

import { SendPayload, createSendPayloadSchema } from '../schema';
import { getDefaultTokenForChainId, getSendFormDefaultValues } from '../utils';

interface Properties {
  allowedChainsIds: number[];
  resetErrors: () => void;
}

export const useSendForm = ({ allowedChainsIds, resetErrors }: Properties) => {
  const formMethods = useForm<SendPayload>({
    defaultValues: getSendFormDefaultValues(allowedChainsIds),
    resolver: zodResolver(createSendPayloadSchema(allowedChainsIds)),
  });

  const [chainId, amount, tokenAddress] = formMethods.watch([
    'chainId',
    'amount',
    'tokenAddress',
  ]);

  const previousTokenAddressReference = useRef<Hex | null>(null);

  // Check if token has changed and reset errors if needed
  useEffect(() => {
    if (
      previousTokenAddressReference.current &&
      previousTokenAddressReference.current !== tokenAddress
    ) {
      resetErrors();
    }
    previousTokenAddressReference.current = tokenAddress;
  }, [tokenAddress, resetErrors]);

  const onChangeChainId = useCallback(
    (chainId: number) => {
      formMethods.resetField('tokenAddress', {
        defaultValue: getDefaultTokenForChainId(chainId).address,
      });
      resetErrors();
    },
    [formMethods, resetErrors],
  );

  const selectedToken = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
      return token.address === tokenAddress;
    });
  }, [chainId, tokenAddress]);

  return { formMethods, chainId, amount, selectedToken, onChangeChainId };
};
