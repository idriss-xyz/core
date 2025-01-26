import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { useAccount, useWalletClient, useWriteContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { StakingABI, stakingContractAddress } from '../constants';
import { encodeFunctionData } from 'viem';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { baseSepolia } from 'viem/chains';

type FormPayload = {
  amount: number;
};

export const StakeTabContent = () => {
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
        console.error("Wallet not connected")
        return;
      }
      const stakeData = {
        abi: StakingABI,
        functionName: 'stake',
        args: [data.amount],
      };

      console.log("input data", data)

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
              label="Amount"
              numeric
            />
          );
        }}
      />
      <Button
        intent="primary"
        size="large"
        className="mt-8 w-full" // TODO: check margin on DS
        type='submit'
      >
        STAKE
      </Button>
    </Form>
  );
};
