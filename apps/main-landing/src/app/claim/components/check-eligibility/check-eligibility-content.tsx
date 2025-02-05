/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Controller, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { Form } from '@idriss-xyz/ui/form';
import { useWalletClient } from 'wagmi';
import { FormEvent, useEffect } from 'react';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';

import { IDRISS_COIN } from '@/assets';
import { useClaim } from '@/app/claim/hooks/use-claim';

type FormValues = {
  address: string;
  resolvedEnsAddress?: string;
};

const EMPTY_FORM: FormValues = {
  address: '',
  resolvedEnsAddress: undefined,
};

export const CheckEligibilityContent = () => {
  const { data: walletClient } = useWalletClient();
  const { verifyEligibility, resolveEnsAddress } = useClaim();

  const formMethods = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const isValid = await formMethods.trigger();

    if (!isValid) {
      return;
    }

    const { address, resolvedEnsAddress } = formMethods.getValues();

    verifyEligibility.use({
      address,
      resolvedEnsAddress,
    });
  };

  useEffect(() => {
    if (walletClient?.account.address) {
      formMethods.setValue('address', walletClient.account.address);
    }
  }, [walletClient?.account.address, formMethods]);

  return (
    <div className="relative z-[5] flex w-[800px] flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        borderWidth={1}
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
      />

      <img className="size-[136px]" src={IDRISS_COIN.src} alt="" />

      <div className="relative flex w-full flex-col items-center gap-2 rounded-[25px] bg-[rgba(255,255,255,0.2)] px-10 py-8">
        <GradientBorder
          borderWidth={1}
          gradientDirection="toBottom"
          gradientStartColor="#ffffff"
          gradientStopColor="rgba(145, 206, 154)"
        />

        <span className="text-heading3 gradient-text">CLAIM YOUR $IDRISS</span>

        <Form className="w-full" onSubmit={handleSubmit}>
          <Controller
            name="address"
            control={formMethods.control}
            rules={{
              required: 'Address is required',
              validate: async (value) => {
                try {
                  if (value.includes('.') && !value.endsWith('.')) {
                    const resolvedAddress = await resolveEnsAddress.use({
                      name: value,
                    });

                    if (resolvedAddress) {
                      formMethods.setValue(
                        'resolvedEnsAddress',
                        resolvedAddress,
                        { shouldValidate: false },
                      );

                      return true;
                    }

                    return 'This address doesn’t exist.';
                  }

                  return isAddress(value)
                    ? true
                    : 'This address doesn’t exist.';
                } catch {
                  return 'An unexpected error occurred. Try again.';
                }
              },
            }}
            render={({ field, fieldState }) => {
              return (
                <Form.Field
                  {...field}
                  label="Wallet address"
                  className="mt-6 w-full"
                  helperText={fieldState.error?.message}
                  error={Boolean(fieldState.error?.message)}
                />
              );
            }}
          />
        </Form>
      </div>

      <GeoConditionalButton
        defaultButton={
          <Button
            size="large"
            intent="primary"
            onClick={handleSubmit}
            suffixIconName="IdrissArrowRight"
            loading={resolveEnsAddress.isPending || verifyEligibility.isPending}
          >
            CHECK ELIGIBILITY
          </Button>
        }
      />
    </div>
  );
};
