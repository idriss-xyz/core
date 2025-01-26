import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createPublicClient, formatEther, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useWalletClient } from 'wagmi';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';

import { StakingABI, stakingContractAddress } from '../constants';

type FormPayload = {
  amount: number;
};

export const UnstakeTabContent = () => {
  const [availableAmount, setAvailableAmount] = useState<string>();
  const { data: walletClient } = useWalletClient();

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  const formMethods = useForm<FormPayload>({
    defaultValues: {
      amount: 1,
    },
    mode: 'onSubmit',
  });

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
  }, [walletClient]);

  return (
    <Form className="w-full">
      <Controller
        control={formMethods.control}
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
              UNLOCK
            </Button>
          }
        />
      </div>
    </Form>
  );
};
