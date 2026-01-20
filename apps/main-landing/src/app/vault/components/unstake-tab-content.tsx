import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Controller, useForm } from 'react-hook-form';
import { RadialGradientBorder } from '@idriss-xyz/ui/gradient-border';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';
import { TxLoadingModal } from '@idriss-xyz/ui/tx-loading-modal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { Icon } from '@idriss-xyz/ui/icon';

import { useStaking } from '@/app/vault/hooks/use-staking';
import { TxLoadingHeadingParameters } from '@/app/vault/types';

type FormPayload = {
  amount: number;
  termsChecked: boolean;
};

export const UnstakeTabContent = () => {
  const { unstake, stakedBalance, rewards, account, claim, claimAndLock } =
    useStaking();

  const { handleSubmit, control, watch } = useForm<FormPayload>();

  const handleUnstake = (payload: FormPayload) => {
    void unstake.use({ amount: payload.amount });
  };

  const handleClaim = () => {
    void claim.use();
  };

  const handleClaimAndLock = () => {
    void claimAndLock.use();
  };

  // To display modal with different messages based on the current pending operation
  const loadingStates = [
    {
      isPending: unstake.isPending,
      pendingAmount: unstake.pendingAmount,
      action: 'Unlocking',
    },
    {
      isPending: claim.isPending,
      pendingAmount: claim.pendingAmount,
      action: 'Claiming',
    },
    {
      isPending: claimAndLock.isPending,
      pendingAmount: claimAndLock.pendingAmount,
      action: 'Claiming and locking',
    },
  ];

  // Find the current pending operation (if any)
  const currentOperation = loadingStates.find((state) => {
    return state.isPending;
  });

  return (
    <>
      {currentOperation && (
        <TxLoadingModal
          show
          heading={
            <TxLoadingHeading
              amount={currentOperation.pendingAmount}
              action={currentOperation.action}
            />
          }
        />
      )}

      <div className="relative mt-4 lg:mt-6">
        <RadialGradientBorder />

        <div className="flex flex-col gap-y-2 rounded-2xl bg-white/20 p-6">
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">Locked balance</p>
            <p className="text-label3 text-neutralGreen-700">
              {stakedBalance.formattedAmount} IDRISS
            </p>
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-x-1">
              <p className="text-body4 text-neutralGreen-500">Rewards</p>
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon
                      name="HelpCircle"
                      size={15}
                      className="text-neutralGreen-500"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-pretty bg-black text-left text-white">
                    <p className="text-label6">
                      12% APR distributed every 6 months.
                      <br />
                      First payout: July 6, 2025.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-label3 text-neutralGreen-700">
              {rewards.amount != '0' && (
                <>
                  <span
                    className="mx-2 text-body5 text-mint-700 underline hover:cursor-pointer"
                    onClick={handleClaim}
                  >
                    Claim
                  </span>
                  <span
                    className="mx-2 text-body5 text-mint-700 underline hover:cursor-pointer"
                    onClick={handleClaimAndLock}
                  >
                    Claim & lock
                  </span>
                </>
              )}
              {rewards.formattedAmount} IDRISS
            </p>
          </div>
        </div>
      </div>

      <Form className="w-full" onSubmit={handleSubmit(handleUnstake)}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            return (
              <div className="mt-4 lg:mt-6">
                <div className="mb-2 flex w-full items-center justify-between text-label4 text-neutralGreen-900">
                  <span className="text-label4 text-neutralGreen-700">
                    Amount to unlock
                  </span>

                  {account.isConnected && (
                    <div
                      className="flex text-label6 text-neutral-800 hover:cursor-pointer"
                      onClick={() => {
                        field.onChange(stakedBalance.amount);
                      }}
                    >
                      Available:{' '}
                      <span className="mx-1 flex justify-center">
                        {stakedBalance.formattedAmount ?? (
                          <Spinner className="size-3" />
                        )}
                      </span>{' '}
                      IDRISS
                    </div>
                  )}
                </div>
                <Form.Field
                  {...field}
                  value={field.value?.toString()}
                  onChange={(value) => {
                    field.onChange(Number(value));
                  }}
                  numeric
                  decimalScale={18}
                  prefixIconName="IdrissCircled"
                  suffixElement={
                    <span className="text-body4 text-neutral-500">IDRISS</span>
                  }
                />
              </div>
            );
          }}
        />

        <span className="my-4 block h-px bg-mint-200 opacity-50 lg:mb-4 lg:mt-6" />

        <Controller
          name="termsChecked"
          control={control}
          render={({ field }) => {
            return (
              <Checkbox
                {...field}
                rootClassName="border-neutral-200"
                label={
                  <span className="w-full text-body5 text-neutralGreen-900">
                    By unlocking, you agree to the{' '}
                    <Link
                      size="medium"
                      href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                      isExternal
                      className="text-body5 md:text-body5 lg:text-body5"
                    >
                      Terms and conditions
                    </Link>
                  </span>
                }
              />
            );
          }}
        />

        <GeoConditionalButton
          defaultButton={
            <Button
              intent="primary"
              size="large"
              className="mt-4 w-full lg:mt-6"
              type="submit"
              disabled={
                !watch('termsChecked') ||
                ((Number(watch('amount')) <= 0 ||
                  watch('amount') === undefined ||
                  Number(watch('amount')) > Number(stakedBalance.amount)) &&
                  account.isConnected)
              }
            >
              {account.isConnected ? 'UNLOCK' : 'LOG IN'}
            </Button>
          }
          className="mt-4 w-full lg:mt-6 lg:w-full"
        />
      </Form>
    </>
  );
};

const TxLoadingHeading = ({ amount, action }: TxLoadingHeadingParameters) => {
  return (
    <>
      {action} <span className="text-mint-600">{amount.toLocaleString()}</span>{' '}
      IDRISS
    </>
  );
};
