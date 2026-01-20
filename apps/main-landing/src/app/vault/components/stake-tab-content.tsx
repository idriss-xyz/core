import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';
import { TxLoadingModal } from '@idriss-xyz/ui/tx-loading-modal';

import { useStaking } from '@/app/vault/hooks/use-staking';

import { TxLoadingHeadingParameters } from '../types';

type FormPayload = {
  amount: number;
  termsChecked: boolean;
};

export const StakeTabContent = () => {
  const { stake, unstakedBalance, account } = useStaking();

  const { handleSubmit, control, watch } = useForm<FormPayload>();

  const handleStake = (payload: FormPayload) => {
    void stake.use({ amount: payload.amount });
  };

  return (
    <>
      <TxLoadingModal
        show={stake.isPending}
        heading={
          <TxLoadingHeading amount={stake.pendingAmount} action="Locking" />
        }
      />

      <Form className="w-full" onSubmit={handleSubmit(handleStake)}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => {
            return (
              <div className="mt-4 lg:mt-6">
                <div className="mb-2 flex w-full items-center justify-between text-label4 text-neutralGreen-900">
                  <span className="text-label4 text-neutralGreen-700">
                    Amount
                  </span>

                  {account.isConnected && (
                    <div
                      className="flex text-label6 text-neutral-800 hover:cursor-pointer"
                      onClick={() => {
                        field.onChange(unstakedBalance.amount);
                      }}
                    >
                      Available:{' '}
                      <span className="mx-1 flex justify-center">
                        {unstakedBalance.formattedAmount ?? (
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
                    By locking, you agree to the{' '}
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
                  Number(watch('amount')) > Number(unstakedBalance.amount)) &&
                  account.isConnected)
              }
            >
              {account.isConnected ? 'LOCK' : 'LOG IN'}
            </Button>
          }
          className="mt-4 w-full lg:mt-6 lg:w-full"
        />
      </Form>
    </>
  );
};

const TxLoadingHeading = ({ amount }: TxLoadingHeadingParameters) => {
  return (
    <>
      Locking <span className="text-mint-600">{amount.toLocaleString()}</span>{' '}
      IDRISS
    </>
  );
};
