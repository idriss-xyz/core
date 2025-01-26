/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { RadioGroup, RadioItem } from '@idriss-xyz/ui/radio-group';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';

import { useClaimPage, VestingPlan } from '../../claim-page-context';

type FormPayload = {
  vestingPlan: VestingPlan;
};

export const VestingPlanContent = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const { eligibilityData, setCurrentContent, setVestingPlan } = useClaimPage();

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      vestingPlan: 'claim_50',
    },
    mode: 'onSubmit',
  });

  const [vestingPlan] = formMethods.watch(['vestingPlan']);

  const vestingPlanOptions: RadioItem<VestingPlan>[] = [
    {
      label: `EARLY: Claim ${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(
        Number((eligibilityData?.allocation ?? 0) / 2),
      )} (50%) now and forego the rest`,
      value: 'claim_50',
    },
    {
      label: `FULL: Claim ${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(
        Number(eligibilityData?.allocation ?? 0),
      )} (100%) and have it unlocked in your vault on July 6, 2025, with benefits starting today`,
      value: 'claim_and_stake_100',
    },
  ];

  const vestingPlanButtonLabel = useMemo(() => {
    switch (vestingPlan) {
      case 'claim_50': {
        return 'CLAIM 50%';
      }

      case 'claim_and_stake_100': {
        return 'CLAIM & LOCK 100%';
      }

      default: {
        return 'CLAIM NOW';
      }
    }
  }, [vestingPlan]);

  if (!eligibilityData) {
    setCurrentContent('check-eligibility');
    return;
  }

  return (
    <div className="relative z-[5] flex w-[800px] flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="flex w-[485px] flex-col gap-6">
        <span className="text-label3 text-neutralGreen-700">
          SELECT YOUR PLAN
        </span>
        <Form className="w-full">
          <Controller
            control={formMethods.control}
            name="vestingPlan"
            rules={{
              required: 'vesting plan is required',
            }}
            render={({ field }) => {
              return <RadioGroup {...field} items={vestingPlanOptions} />;
            }}
          />
        </Form>
        <div className="w-full border-t border-mint-200 opacity-50" />
        <div className="mb-4 flex w-full flex-row items-center">
          <Checkbox
            onChange={setTermsChecked}
            value={termsChecked}
            rootClassName="border-neutral-300"
            label={
              <span className="w-full text-body5 text-neutralGreen-900">
                By claiming, you agree to the{' '}
                <Link
                  size="medium"
                  href=""
                  isExternal
                  className="text-body5 lg:text-body5"
                >
                  Terms{'\u00A0'}and{'\u00A0'}conditions
                </Link>
              </span>
            }
          />
        </div>
        <Button
          intent="primary"
          size="large"
          className="w-full"
          onClick={() => {
            setVestingPlan(vestingPlan);
            return setCurrentContent('claim-successful');
          }}
          disabled={!termsChecked}
        >
          {vestingPlanButtonLabel}
        </Button>
      </div>
      <div className="mx-10 w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />
      <div className="flex w-[389px] flex-col">
        <div className="flex flex-col gap-2">
          <span className="pb-4 text-label3 text-neutralGreen-700">
            VAULT BENEFITS
          </span>
          <div className="flex gap-2">
            <Icon name="PiggyBank" size={24} className="text-gray-300" />
            <span className="text-body3 text-neutralGreen-700">
              Earn <span className="gradient-text">12% APR</span> on locked
              tokens
            </span>
          </div>
          <div className="flex gap-2">
            <Icon name="Gem" size={24} className="text-gray-300" />
            <span className="text-body3 text-neutralGreen-700">
              Lock <span className="gradient-text">10,000 $IDRISS</span> or more
              to access premium features
            </span>
          </div>
          <div className="flex gap-2">
            <Icon name="PieChart" size={24} className="text-gray-300" />
            <span className="text-body3 text-neutralGreen-700">
              Tap into decentralized revenue sharing from IDRISS apps
            </span>
          </div>
        </div>

        <Button
          intent="tertiary"
          size="medium"
          isExternal
          asLink
          className="mt-8 w-full"
          suffixIconName="ArrowRight"
          href="#"
        >
          LEARN MORE
        </Button>
      </div>
    </div>
  );
};
