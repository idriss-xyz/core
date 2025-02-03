import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';
import { TxLoadingModal } from '@/app/claim/components/tx-loading-modal/tx-loading-modal';
import { useStaking } from '@/app/vault/hooks/use-staking';

import { TxLoadingHeadingParameters } from '../types';

type FormPayload = {
  amount: number;
  termsChecked: boolean;
};

export const StakeTabContent = () => {
  const { stake, unStakedBalance, account } = useStaking();

  const { handleSubmit, control, watch } = useForm<FormPayload>();

  const handleStake = (payload: FormPayload) => {
    void stake.use({ amount: payload.amount });
  };

  return (
    <>
      <TxLoadingModal
        show={stake.isPending}
        heading={<TxLoadingHeading amount={stake.pendingAmount} />}
      />
      <Form className="w-full" onSubmit={handleSubmit(handleStake)}>
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
                      Amount
                    </span>
                    {account.isConnected ? (
                      <div
                        className="flex text-label6 text-neutral-800 hover:cursor-pointer"
                        onClick={() => {
                          field.onChange(unStakedBalance.amount);
                        }}
                      >
                        Available:{' '}
                        <span className="mx-1 flex justify-center">
                          {unStakedBalance.formattedAmount ?? (
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
                  watch('amount') > Number(unStakedBalance.amount)
                }
              >
                {account.isConnected ? 'LOCK' : 'LOG IN'}
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
      Locking <span className="text-mint-600">{amount.toLocaleString()}</span>{' '}
      IDRISS
    </>
  );
};
