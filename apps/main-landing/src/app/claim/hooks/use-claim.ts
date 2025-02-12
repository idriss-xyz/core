import { encodeFunctionData, Hex } from 'viem';
import { base } from 'viem/chains';
import { useCallback, useState } from 'react';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import {
  ClaimTokensPayload,
  ResolveEnsAddressPayload,
  StoreDataAndNavigatePayload,
  VerifyEligibilityPayload,
} from '@/app/claim/types';
import { CLAIM_ABI, CLAIMER_ADDRESS } from '@/app/claim/constants';
import { useClaimPage } from '@/app/claim/claim-page-context';
import { useCheckEligibility } from '@/app/claim/commands/check-eligibility';
import { useResolveEnsAddress } from '@/app/claim/commands/resolve-ens-address';
import { useCheckClaimStatus } from '@/app/claim/commands/check-claim-status';

export const useClaim = () => {
  const {
    setCurrentContent,
    setWalletAddress,
    setEligibilityData,
    setHasAlreadyClaimed,
    eligibilityData,
  } = useClaimPage();
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const [claimIsPending, setClaimIsPending] = useState<boolean>(false);

  const eligibilityMutation = useCheckEligibility();
  const checkClaimStatusMutation = useCheckClaimStatus();
  const resolveEnsAddressMutation = useResolveEnsAddress();

  const storeDataAndNavigate = useCallback(
    async (payload: StoreDataAndNavigatePayload) => {
      const eligibility = await eligibilityMutation.mutateAsync({
        address: payload.address,
      });

      setEligibilityData(eligibility);
      setWalletAddress(payload.address);

      if (!eligibility.claimData && eligibility.allocation === 0) {
        setCurrentContent('not-eligible');

        return;
      }

      const isClaimed = await checkClaimStatusMutation.mutateAsync({
        claimData: eligibility.claimData,
      });

      if (isClaimed) {
        setCurrentContent('claim-successful');
        setHasAlreadyClaimed(true);

        return;
      }

      setCurrentContent(eligibility.allocation ? 'claim' : 'not-eligible');
    },
    [
      checkClaimStatusMutation,
      eligibilityMutation,
      setCurrentContent,
      setEligibilityData,
      setHasAlreadyClaimed,
      setWalletAddress,
    ],
  );

  const claimCallback = async (payload: ClaimTokensPayload) => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      if (!eligibilityData) {
        setCurrentContent('check-eligibility');

        return;
      }

      if (!walletClient) {
        return;
      }

      setClaimIsPending(true);

      try {
        const claimData = {
          abi: CLAIM_ABI,
          functionName:
            payload.vestingPlan === 'claim_50' ? 'claim' : 'claimWithBonus',
          args: [
            walletClient.account.address,
            eligibilityData.claimData.amount,
            eligibilityData.claimData.claimIndices,
            eligibilityData.claimData.signature,
            eligibilityData.claimData.expiry,
            `0x${Buffer.from(eligibilityData.claimData.memo, 'utf8').toString('hex')}`,
          ],
        };
        const encodedClaimData = encodeFunctionData(claimData);

        await switchChainAsync({ chainId: base.id });

        const gas = await estimateGas(walletClient, {
          to: CLAIMER_ADDRESS,
          data: encodedClaimData,
        }).catch((error) => {
          console.error('Error estimating gas:', error.message);
          throw error;
        });

        const hash = await writeContractAsync({
          address: CLAIMER_ADDRESS,
          chain: base,
          ...claimData,
          gas,
        });

        const { status } = await waitForTransactionReceipt(walletClient, {
          hash,
        });

        setClaimIsPending(false);

        if (status === 'reverted') {
          throw new Error('Claim transaction reverted');
        }

        return setCurrentContent('claim-successful');
      } catch (error) {
        setClaimIsPending(false);

        throw error;
      }
    }
  };

  const verifyCallback = useCallback(
    (payload: VerifyEligibilityPayload) => {
      if (payload.address.includes('.') && payload.resolvedEnsAddress) {
        void storeDataAndNavigate({
          address: payload.resolvedEnsAddress as Hex,
        });
      } else if (payload.address) {
        void storeDataAndNavigate({ address: payload.address as Hex });
      }
    },
    [storeDataAndNavigate],
  );

  const resolveEnsAddressCallback = useCallback(
    async (payload: ResolveEnsAddressPayload) => {
      return await resolveEnsAddressMutation.mutateAsync(payload);
    },
    [resolveEnsAddressMutation],
  );

  const claimTokens = {
    use: (payload: ClaimTokensPayload) => {
      return claimCallback(payload);
    },
    isPending: claimIsPending,
  };

  const verifyEligibility = {
    use: (payload: VerifyEligibilityPayload) => {
      return verifyCallback(payload);
    },
    isError: eligibilityMutation.isError,
    isPending: eligibilityMutation.isPending,
    isSuccess: eligibilityMutation.isSuccess,
  };

  const resolveEnsAddress = {
    use: (payload: ResolveEnsAddressPayload) => {
      return resolveEnsAddressCallback(payload);
    },
    isError: resolveEnsAddressMutation.isError,
    isPending: resolveEnsAddressMutation.isPending,
    isSuccess: resolveEnsAddressMutation.isSuccess,
  };

  return {
    claimTokens,
    verifyEligibility,
    resolveEnsAddress,
  };
};
