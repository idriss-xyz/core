import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
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
import { RadialGradientBorder } from '@idriss-xyz/ui/gradient-border';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';

import { StakingABI, STAKER_ADDRESS } from '../constants';
import { ClaimedEventsResponse } from '../types';

type FormPayload = {
  amount: number;
};

const txLoadingHeading = (amount: number) => {
  return (
    <>
      Unlocking <span className="text-mint-600">{amount.toLocaleString()}</span>{' '}
      IDRISS
    </>
  );
};

export const UnstakeTabContent = () => {
  const [stakedAmount, setStakedAmount] = useState<string>();
  const [blockedAmount, setBlockedAmount] = useState<string>();
  const [totalLockedAmount, setTotalLockedAmount] = useState<string>();
  const [termsChecked, setTermsChecked] = useState(false);
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
        const stakedBalance = await publicClient.readContract({
          abi: StakingABI,
          address: STAKER_ADDRESS,
          functionName: 'getStakedBalance',
          args: [walletClient.account.address],
        });

        const formattedStakedAmount = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(formatEther(stakedBalance as bigint)) ?? 0);

        setStakedAmount(formattedStakedAmount);
      } catch (error) {
        setStakedAmount('0');
        console.error('Error fetching staked balance:', error);
      }

      try {
        const claimedEvents = await fetch('/api/claimed-events');

        const claimedEventsData =
          (await claimedEvents.json()) as ClaimedEventsResponse;

        const claimedEvent = claimedEventsData.events.find((event) => {
          return event.to === walletClient.account.address && event.bonus;
        });

        const formattedBlockedAmount = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(claimedEvent?.total ?? 0));

        console.log(claimedEvent?.total);

        setBlockedAmount(formattedBlockedAmount);
      } catch (error) {
        setBlockedAmount('0');
        console.error('Error fetching blocked amount:', error);
      }
    })();
  }, [walletClient, publicClient]);

  useEffect(() => {
    if (stakedAmount && blockedAmount) {
      try {
        const totalLocked =
          (Number(stakedAmount.replaceAll(',', '')) || 0) +
          (Number(blockedAmount.replaceAll(',', '')) || 0);

        setTotalLockedAmount(
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(totalLocked),
        );
      } catch (error) {
        setTotalLockedAmount('0');
        console.error('Error calculating total locked amount:', error);
      }
    }
  }, [stakedAmount, blockedAmount]);

  return (
    <>
      <TxLoadingModal show={isLoading} heading={txLoadingHeading(amount)} />
      <div className="relative mt-4 lg:mt-6">
        <RadialGradientBorder />
        <div className="flex flex-col gap-y-2 rounded-2xl bg-white/20 p-6">
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">Total locked</p>
            {totalLockedAmount ? (
              <p className="text-label3 text-neutralGreen-700">
                {totalLockedAmount} IDRISS
              </p>
            ) : (
              <p className="text-label3 text-neutralGreen-700">0 IDRISS</p>
            )}
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">Unlockable</p>
            {stakedAmount ? (
              <p className="text-label3 text-neutralGreen-700">
                {stakedAmount} IDRISS
              </p>
            ) : (
              <p className="text-label3 text-neutralGreen-700">0 IDRISS</p>
            )}
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">
              Unlockable from July 6
            </p>
            {blockedAmount ? (
              <p className="text-label3 text-neutralGreen-700">
                {blockedAmount} IDRISS
              </p>
            ) : (
              <p className="text-label3 text-neutralGreen-700">0 IDRISS</p>
            )}
          </div>
        </div>
      </div>
      <Form className="w-full" onSubmit={handleSubmit(handleUnstake)}>
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
                      Amount to unlock
                    </span>
                    {walletClient ? (
                      <div
                        className="flex text-label6 text-neutral-800 hover:cursor-pointer"
                        onClick={() => {
                          field.onChange(stakedAmount);
                        }}
                      >
                        Available:{' '}
                        <span className="mx-1 flex justify-center">
                          {stakedAmount ?? <Spinner className="size-3" />}
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
              By unlocking, you agree to the{' '}
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
                {isConnected ? 'UNLOCK' : 'LOG IN'}
              </Button>
            }
          />
        </div>
      </Form>
    </>
  );
};
