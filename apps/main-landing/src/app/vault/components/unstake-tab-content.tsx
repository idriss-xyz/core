import { Button } from '@idriss-xyz/ui/button';
import { Form } from '@idriss-xyz/ui/form';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { Controller, useForm } from 'react-hook-form';
import { RadialGradientBorder } from '@idriss-xyz/ui/gradient-border';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';
import { useStaking } from '@/app/vault/hooks/use-staking';
import { TxLoadingHeadingParameters } from '@/app/vault/types';

type FormPayload = {
  amount: number;
  termsChecked: boolean;
};

export const UnstakeTabContent = () => {
  const {
    unstake,
    stakedBalance,
    stakedBonusBalance,
    totalStakedBalance,
    account,
  } = useStaking();

  const { handleSubmit, control, watch } = useForm<FormPayload>();

  const handleUnstake = (payload: FormPayload) => {
    void unstake.use({ amount: payload.amount });
  };

  return (
    <>
      <TxLoadingModal
        show={unstake.isPending}
        heading={<TxLoadingHeading amount={unstake.pendingAmount} />}
      />
      <div className="relative mt-4 lg:mt-6">
        <RadialGradientBorder />
        <div className="flex flex-col gap-y-2 rounded-2xl bg-white/20 p-6">
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">Total locked</p>
            <p className="text-label3 text-neutralGreen-700">
              {totalStakedBalance.formattedAmount} IDRISS
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">Unlockable</p>
            <p className="text-label3 text-neutralGreen-700">
              {stakedBalance.formattedAmount} IDRISS
            </p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-body4 text-neutralGreen-500">
              Unlockable from July 6
            </p>
            <p className="text-label3 text-neutralGreen-700">
              {stakedBonusBalance.formattedAmount} IDRISS
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
              <Form.Field
                {...field}
                className="mt-4 lg:mt-6"
                value={field.value?.toString()}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                label={
                  <div className="flex justify-between">
                    <span className="text-label4 text-neutralGreen-700">
                      Amount to unlock
                    </span>
                    {account.isConnected ? (
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
                    ) : (
                      ''
                    )}
                  </div>
                }
                numeric
                decimalScale={18}
                prefixIconName="IdrissCircled"
                suffixElement={
                  <span className="text-body4 text-neutral-500">IDRISS</span>
                }
              />
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
                      className="text-body5 lg:text-body5"
                    >
                      Terms and conditions
                    </Link>
                  </span>
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
                className="mt-4 w-full lg:mt-6"
                type="submit"
                disabled={
                  !watch('termsChecked') &&
                  watch('amount') <= 0 &&
                  watch('amount') > Number(stakedBalance.amount)
                }
              >
                {account.isConnected ? 'UNLOCK' : 'LOG IN'}
              </Button>
            }
          />
        </div>
      </Form>
    </>
  );
};

const TxLoadingHeading = ({ amount }: TxLoadingHeadingParameters) => {
  return (
    <>
      Unlocking <span className="text-mint-600">{amount.toLocaleString()}</span>{' '}
      IDRISS
    </>
  );
};
