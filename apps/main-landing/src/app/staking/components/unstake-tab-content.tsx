import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  createPublicClient,
  encodeFunctionData,
  formatEther,
  http,
  parseEther,
} from 'viem';
import { base } from 'viem/chains';
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';

import { StakingABI, stakingContractAddress } from '../constants';

type FormPayload = {
  amount: number;
};

const txLoadingHeading = (amount: number) => {
  return (
    <>
      Unlocking <span className="text-mint-600">${amount}</span> IDRISS
    </>
  );
};

export const UnstakeTabContent = () => {
  const [availableAmount, setAvailableAmount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });
  const { handleSubmit, control, watch } = useForm<FormPayload>({
    defaultValues: {
      amount: 1,
    },
    mode: 'onSubmit',
  });

  const amount = watch('amount');

  const handleUnstake = async (data: FormPayload) => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      try {
        setIsLoading(true);

        if (!walletClient) {
          console.error('Wallet not connected');
          return;
        }

        const parsedAmount = parseEther(data.amount.toString());

        await switchChainAsync({ chainId: base.id });

        const stakeData = {
          abi: StakingABI,
          functionName: 'withdraw',
          args: [parsedAmount],
        };

        const encodedStakeData = encodeFunctionData(stakeData);

        const gas = await estimateGas(walletClient, {
          to: stakingContractAddress,
          data: encodedStakeData,
        }).catch((error) => {
          throw error;
        });

        const hash = await writeContractAsync({
          address: stakingContractAddress,
          chain: base,
          ...stakeData,
          gas,
        });

        const { status } = await waitForTransactionReceipt(walletClient, {
          hash,
        });

        setIsLoading(false);

        if (status === 'reverted') {
          throw new Error('Claim transaction reverted');
        }
      } catch (error) {
        setIsLoading(false);

        console.error('Error unlocking:', error);
        throw error;
      }
    }
  };

  useEffect(() => {
    void (async () => {
      if (!walletClient) {
        return;
      }

      try {
        const balance = await publicClient?.readContract({
          abi: StakingABI,
          address: stakingContractAddress,
          functionName: 'getStakedBalance',
          args: [walletClient.account.address],
        });

        const formattedBalance = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(formatEther(balance as bigint)) ?? 0);

        setAvailableAmount(formattedBalance);
      } catch (error) {
        setAvailableAmount('0');
        console.error(error);
      }
    })();
  }, [walletClient, publicClient]);

  return (
    <>
      <TxLoadingModal show={isLoading} heading={txLoadingHeading(amount)} />
      <Form className="w-full" onSubmit={handleSubmit(handleUnstake)}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            return (
              <Form.Field
                {...field}
                className="mt-6"
                value={field.value.toString()}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                label={
                  <div className="flex justify-between">
                    <span className="text-label4 text-neutralGreen-700">
                      Amount to unlock
                    </span>
                    {walletClient ? (
                      <div className="flex text-label6 text-neutral-800">
                        Available:{' '}
                        <span className="mx-1 flex justify-center">
                          {availableAmount ?? <Spinner className="size-3" />}
                        </span>{' '}
                        IDRISS
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                }
                numeric
                prefixIconName="IdrissCircled"
                suffixElement={
                  <span className="text-body4 text-neutral-500">IDRISS</span>
                }
              />
            );
          }}
        />
        <div className="relative">
          <GeoConditionalButton
            defaultButton={
              <Button
                intent="primary"
                size="large"
                className="mt-6 w-full"
                type="submit"
              >
                {isConnected ? 'UNLOCK' : 'LOG IN'}
              </Button>
            }
          />
        </div>
      </Form>
    </>
  );
};
