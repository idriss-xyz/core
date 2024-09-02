import { useCallback, useMemo } from 'react';

import {
  AddressResolver,
  ResolveAddressProperties,
} from 'application/idriss-send';
import { GetWalletByFarcasterUsernameCommand } from 'shared/farcaster';
import { useCommandMutation } from 'shared/messaging';
import { GetWalletByEnsNameCommand } from 'shared/web3';

import { useLocationInfo } from './use-location-info';

export const useAddressResolver = (): AddressResolver => {
  const { isWarpcast } = useLocationInfo();

  const getWalletByFarcasterUsernameMutation = useCommandMutation(
    GetWalletByFarcasterUsernameCommand,
  );

  const getWalletByEnsNameMutation = useCommandMutation(
    GetWalletByEnsNameCommand,
  );

  const resolve = useCallback(
    async (properties: ResolveAddressProperties) => {
      // on other socials like Twitter we pre-fetch address and it's already defined in WidgetData
      if (!isWarpcast) {
        return properties.walletAddress;
      }

      if (properties.username.endsWith('.eth')) {
        return getWalletByEnsNameMutation.mutateAsync({
          username: properties.username,
        });
      }

      return getWalletByFarcasterUsernameMutation.mutateAsync({
        username: properties.username,
      });
    },
    [
      getWalletByEnsNameMutation,
      getWalletByFarcasterUsernameMutation,
      isWarpcast,
    ],
  );

  const reset = useCallback(() => {
    getWalletByFarcasterUsernameMutation.reset();
    getWalletByEnsNameMutation.reset();
  }, [getWalletByEnsNameMutation, getWalletByFarcasterUsernameMutation]);

  const hasError =
    getWalletByFarcasterUsernameMutation.isError ||
    getWalletByEnsNameMutation.isError;

  const isResolving =
    getWalletByFarcasterUsernameMutation.isPending ||
    getWalletByEnsNameMutation.isPending;

  return useMemo(() => {
    return {
      resolve,
      hasError,
      isResolving,
      reset,
    };
  }, [hasError, isResolving, reset, resolve]);
};
