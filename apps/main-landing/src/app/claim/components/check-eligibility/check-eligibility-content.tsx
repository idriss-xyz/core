/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Controller, useForm } from 'react-hook-form';
import { createPublicClient, http, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { Form } from '@idriss-xyz/ui/form';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';

import idrissCoin from '../../assets/IDRISS_COIN 1.png';
import { useClaimPage } from '../../claim-page-context';

type FormPayload = {
  address: string;
};

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
});

export const CheckEligibilityContent = () => {
  const {
    navigate,
    setWalletAddress,
    eligibilityData,
    eligibilityDataLoading,
  } = useClaimPage();
  const formMethods = useForm<FormPayload>({
    defaultValues: {
      address: '',
    },
    mode: 'onSubmit',
  });

  const resolveEnsAddressMutation = useMutation({
    mutationFn: async (ens: string) => {
      const resolvedAddress = await ethereumClient?.getEnsAddress({
        name: normalize(ens),
      });
      return resolvedAddress;
    },
  });

  const verifyEligibility = async () => {
    const isValid = await formMethods.trigger();
    if (!isValid) {
      return;
    }

    const { address } = formMethods.getValues();
    let resolvedAddress: string | null | undefined = address;
    if (address.includes('.')) {
      resolvedAddress = await resolveEnsAddressMutation.mutateAsync(address);
    }

    if (resolvedAddress) {
      setWalletAddress(resolvedAddress);
    }
  };

  useEffect(() => {
    if (eligibilityData) {
      navigate('/claim');
    }
  }, [eligibilityData, navigate]);

  return (
    <div className="z-[5] inline-flex flex-col items-center gap-4 overflow-hidden px-4 pb-3 pt-6 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-display2 gradient-text">COMMUNITY AIRDROP</h1>
        <span className="text-body2 text-neutralGreen-900 opacity-70">
          Check your eligibility and claim $IDRISS
        </span>
      </div>
      <div className="relative flex w-full flex-col items-center gap-10 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-[40px_40px_60px_40px] backdrop-blur-[45px]">
        <GradientBorder
          gradientDirection="toTop"
          gradientStopColor="rgba(145, 206, 154, 0.50)"
          borderWidth={1}
        />
        <img className="size-[136px]" src={idrissCoin.src} alt="" />
        <div className="relative flex w-full flex-col items-center gap-2 rounded-[25px] bg-[rgba(255,255,255,0.2)] px-10 py-8">
          <GradientBorder
            gradientDirection="toBottom"
            gradientStopColor="rgba(145, 206, 154)"
            gradientStartColor="#ffffff"
            borderWidth={1}
          />
          <span className="text-body3 text-neutralGreen-700">CLAIM UNTIL</span>
          <span className="text-heading3 gradient-text">FEBRUARY 28, 2025</span>
          <Form
            className="w-full"
            onSubmit={(event) => {
              event.preventDefault();
              void verifyEligibility();
            }}
          >
            <Controller
              control={formMethods.control}
              name="address"
              rules={{
                required: 'Address is required',
                validate: async (value) => {
                  try {
                    if (value.includes('.') && !value.endsWith('.')) {
                      const resolvedAddress =
                        await resolveEnsAddressMutation.mutateAsync(value);

                      return resolvedAddress
                        ? true
                        : 'This address doesn’t exist.';
                    }
                    return isAddress(value)
                      ? true
                      : 'This address doesn’t exist.';
                  } catch (error) {
                    console.error(error);
                    return 'An unexpected error occurred. Try again.';
                  }
                },
              }}
              render={({ field, fieldState }) => {
                return (
                  <Form.Field
                    label="Wallet address"
                    className="mt-6 w-full"
                    helperText={fieldState.error?.message}
                    error={Boolean(fieldState.error?.message)}
                    {...field}
                  />
                );
              }}
            />
          </Form>
        </div>
        <Button
          intent="primary"
          size="large"
          suffixIconName="ArrowRight"
          onClick={verifyEligibility}
          loading={
            resolveEnsAddressMutation.isPending || eligibilityDataLoading
          }
        >
          CHECK ELIGIBILITY
        </Button>
      </div>
    </div>
  );
};
