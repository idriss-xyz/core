import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Config, useAccount, useWalletClient, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  decodeFunctionResult,
  encodeFunctionData,
  parseEther,
  WalletClient,
} from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { baseSepolia } from 'viem/chains';
import { WriteContractMutateAsync } from 'wagmi/query';

import { ERC20_ABI } from '@/app/creators/donate/constants';

import {
  StakingABI,
  stakingContractAddress,
  testTokenAddress,
} from '../constants';

type FormPayload = {
  amount: number;
};
type Properties = {
  availableAmount: number;
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

export const StakeTabContent = ({ availableAmount }: Properties) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const { handleSubmit, control } = useForm<FormPayload>({
    defaultValues: {
      amount: 1,
    },
    mode: 'onSubmit',
  });

  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const handleStake = async (data: FormPayload) => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      if (!walletClient) {
        console.error('Wallet not connected');
        return;
      }

      const parsedAmount = parseEther(data.amount.toString());

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

      if (status === 'reverted') {
        throw new Error('Claim transaction reverted');
      }
    }
  };

  return (
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
                  <span className="text-label6 text-neutral-800">
                    Available: {availableAmount} IDRISS
                  </span>
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
      <Button
        intent="primary"
        size="large"
        className="mt-8 w-full" // TODO: check margin on DS
        type="submit"
      >
        STAKE
      </Button>
    </Form>
  );
};
