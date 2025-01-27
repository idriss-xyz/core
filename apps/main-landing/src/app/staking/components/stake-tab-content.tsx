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
import { baseSepolia } from 'viem/chains';
import { WriteContractMutateAsync } from 'wagmi/query';
import { useEffect, useState } from 'react';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';

import { ERC20_ABI } from '@/app/creators/donate/constants';
import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';

import {
  StakingABI,
  stakingContractAddress,
  testTokenAddress,
} from '../constants';

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
    args: [walletClient.account.address, stakingContractAddress],
  } as const;

  const encodedAllowanceData = encodeFunctionData(allowanceData);

  const allowanceRaw = await call(walletClient, {
    account: walletClient.account,
    to: testTokenAddress,
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
      args: [stakingContractAddress, tokensToSend],
    } as const;

    const encodedData = encodeFunctionData(approveData);

    const gas = await estimateGas(walletClient, {
      to: testTokenAddress,
      data: encodedData,
    });

    const hash = await writeContractAsync({
      chain: baseSepolia,
      address: testTokenAddress,
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
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const publicClient = createPublicClient({
    chain: baseSepolia,
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

        await switchChainAsync({ chainId: baseSepolia.id });

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
          to: stakingContractAddress,
          data: encodedStakeData,
        }).catch((error) => {
          throw error;
        });

        const hash = await writeContractAsync({
          address: stakingContractAddress,
          chain: baseSepolia,
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
          address: testTokenAddress,
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
                className="mt-4 lg:mt-6"
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
        <div className="my-4 h-px bg-mint-200 opacity-50 lg:mb-4 lg:mt-6" />
        <Checkbox
          onChange={setTermsChecked}
          value={termsChecked}
          rootClassName="border-neutral-200"
          label={
            <span className="w-full text-body5 text-neutralGreen-900">
              By locking, you agree to the{' '}
              <Link
                size="medium"
                href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                isExternal
                className="text-body5 lg:text-body5"
              >
                Terms and conditions
              </Link>
            </span>
          }
        />
        <div className="relative">
          <GeoConditionalButton
            defaultButton={
              <Button
                intent="primary"
                size="large"
                className="mt-4 w-full lg:mt-6"
                type="submit"
                disabled={!termsChecked}
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
