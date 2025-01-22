/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { RadioGroup, RadioItem } from '@idriss-xyz/ui/radio-group';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';

import idrissCoin from '../../assets/IDRISS_COIN 1.png';
import { useClaimPage, VestingPlan } from '../../claim-page-context';

type FormPayload = {
  vestingPlan: VestingPlan;
};

export const VestingPlanContent = () => {
  const { eligibilityData, navigate, setVestingPlan } = useClaimPage();

  const formMethods = useForm<FormPayload>({
    defaultValues: {
      vestingPlan: 'claim_50',
    },
    mode: 'onSubmit',
  });

  const [vestingPlan] = formMethods.watch(['vestingPlan']);

  const vestingPlanOptions: RadioItem<VestingPlan>[] = [
    {
      label: 'Claim 50% amount within 24h',
      value: 'claim_50',
    },
    {
      label: 'Claim and stake 50% airdropped amount (no lock)',
      value: 'claim_and_stake_50',
    },
    {
      label: 'Claim and stake 100% airdropped amount (180 days lock)',
      value: 'claim_and_stake_100',
    },
  ];

  const vestingPlanButtonLabel = useMemo(() => {
    switch (vestingPlan) {
      case 'claim_50': {
        return 'CLAIM 50% NOW';
      }
      case 'claim_and_stake_50': {
        return 'CLAIM & STAKE 50%';
      }
      case 'claim_and_stake_100': {
        return 'CLAIM & STAKE 100%';
      }
      default: {
        return 'CLAIM NOW';
      }
    }
  }, [vestingPlan]);

  if (!eligibilityData) {
    navigate('/check-eligibility');
    return;
  }

  return (
    <div className="z-[5] inline-flex flex-col items-center gap-[78px] overflow-hidden px-4 pb-3 lg:mt-[78px] lg:[@media(max-height:800px)]:mt-[60px]">
      <img className="size-[137px]" src={idrissCoin.src} alt="" />
      <div className="relative flex flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
        <GradientBorder
          gradientDirection="toTop"
          gradientStopColor="rgba(145, 206, 154, 0.50)"
          borderWidth={1}
        />
        <div className="flex w-[459px] flex-col gap-6">
          <span className="text-label3 text-neutralGreen-700">
            SELECT YOUR VESTING PLAN
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

          <Button
            intent="primary"
            size="large"
            className="w-full"
            onClick={() => {
              setVestingPlan(vestingPlan);
              return navigate('/claim-successful');
            }}
          >
            {vestingPlanButtonLabel}
          </Button>
        </div>
        <div className="mx-10 w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />
        <div className="flex w-[389px] flex-col">
          <div className="flex flex-col gap-4">
            <span className="pb-6 text-label3 text-neutralGreen-700">
              STAKING BENEFIT
            </span>
            <div className="flex gap-2">
              <Icon name="PiggyBank" size={24} className="text-gray-300" />
              <span className="text-body3 text-neutralGreen-700">
                Earn <span className="gradient-text">12% APR</span> on staked
                amounts
              </span>
            </div>
            <div className="flex gap-2">
              <Icon name="Gem" size={24} className="text-gray-300" />
              <span className="text-body3 text-neutralGreen-700">
                Stake <span className="gradient-text">10,000 $IDRISS</span> or
                more to unlock all premium features
              </span>
            </div>
            <div className="flex gap-2">
              <Icon name="PieChart" size={24} className="text-gray-300" />
              <span className="text-body3 text-neutralGreen-700">
                Access to decentralized revenue sharing
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
    </div>
  );
};
