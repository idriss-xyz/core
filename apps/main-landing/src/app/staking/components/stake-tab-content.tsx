import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import {
  Config,
  useAccount,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  createPublicClient,
  decodeFunctionResult,
  encodeFunctionData,
  http,
  parseEther,
  WalletClient,
  formatEther,
} from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { base } from 'viem/chains';
import { WriteContractMutateAsync } from 'wagmi/query';
import { useEffect, useState } from 'react';
import { Spinner } from '@idriss-xyz/ui/spinner';

import { ERC20_ABI } from '@/app/creators/donate/constants';
import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';

import {
  StakingABI,
  STAKER_ADDRESS,
} from '../constants';
import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';

type FormPayload = {
  amount: number;
};

const txLoadingHeading = (amount: number) => {
  return (
    <>
      Locking <span className="text-mint-600">${amount}</span> IDRISS
    </>
  );
};

const approveTokens = async (
  walletClient: WalletClient,
  tokensToSend: bigint,
  writeContractAsync: WriteContractMutateAsync<Config, unknown>,
) => {
  if (!walletClient.account) {
    return;
  }
  const allowanceData = {
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [walletClient.account.address, STAKER_ADDRESS],
  } as const;

  const encodedAllowanceData = encodeFunctionData(allowanceData);

  const allowanceRaw = await call(walletClient, {
    account: walletClient.account,
    to: IDRISS_TOKEN_ADDRESS,
    data: encodedAllowanceData,
  });

  if (allowanceRaw.data === undefined) {
    throw new Error('Allowance data is not defined');
  }

  const allowanceNumber = decodeFunctionResult({
    abi: ERC20_ABI,
    functionName: 'allowance',
    data: allowanceRaw.data,
  });

  if (allowanceNumber < tokensToSend) {
    const approveData = {
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [STAKER_ADDRESS, tokensToSend],
    } as const;

    const encodedData = encodeFunctionData(approveData);

    const gas = await estimateGas(walletClient, {
      to: IDRISS_TOKEN_ADDRESS,
      data: encodedData,
    });

    const hash = await writeContractAsync({
      chain: base,
      address: IDRISS_TOKEN_ADDRESS,
      ...approveData,
      gas,
    });

    const receipt = await waitForTransactionReceipt(walletClient, {
      hash,
    });

    if (receipt.status === 'reverted') {
      console.error('Error approving tokens');
    }
  }
};

export const StakeTabContent = () => {
  const [availableAmount, setAvailableAmount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
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

  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const handleStake = async (data: FormPayload) => {
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

        await approveTokens(
          walletClient,
          BigInt(parsedAmount),
          writeContractAsync,
        );

        const stakeData = {
          abi: StakingABI,
          functionName: 'stake',
          args: [parsedAmount],
        };

        const encodedStakeData = encodeFunctionData(stakeData);

        const gas = await estimateGas(walletClient, {
          to: STAKER_ADDRESS,
          data: encodedStakeData,
        }).catch((error) => {
          throw error;
        });

        const hash = await writeContractAsync({
          address: STAKER_ADDRESS,
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

        console.error('Error locking:', error);
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
          abi: ERC20_ABI,
          address: IDRISS_TOKEN_ADDRESS,
          functionName: 'balanceOf',
          args: [walletClient.account.address],
        });

        const formattedBalance = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(formatEther(balance)) ?? 0);

        setAvailableAmount(formattedBalance);
      } catch (error) {
        console.error(error);
        setAvailableAmount('0');
      }
    })();
  }, [walletClient, publicClient]);

  return (
    <>
      <TxLoadingModal show={isLoading} heading={txLoadingHeading(amount)} />
      <Form className="w-full" onSubmit={handleSubmit(handleStake)}>
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
                      Amount
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
                {isConnected ? 'LOCK' : 'LOG IN'}
              </Button>
            }
          />
        </div>
      </Form>
    </>
  );
};
