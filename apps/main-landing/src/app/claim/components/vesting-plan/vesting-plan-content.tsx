/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { RadioGroup, RadioItem } from '@idriss-xyz/ui/radio-group';
import { Form } from '@idriss-xyz/ui/form';
import { Controller, useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Link } from '@idriss-xyz/ui/link';
import { formatEther } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import {
  TOKEN_TERMS_AND_CONDITIONS_LINK,
  VAULT_DOCS_LINK,
} from '@idriss-xyz/constants';
import { GeoConditionalButton } from '@idriss-xyz/ui/geo-conditional-button';

import { useClaim } from '@/app/claim/hooks/use-claim';

import { useClaimPage } from '../../claim-page-context';
import { TxLoadingModal } from '../tx-loading-modal/tx-loading-modal';
import { TxLoadingHeadingParameters, VestingPlan } from '../../types';

type FormValues = {
  vestingPlan: VestingPlan;
  termsChecked: boolean;
};

const EMPTY_FORM: FormValues = {
  vestingPlan: 'claim_50',
  termsChecked: false,
};

export const VestingPlanContent = () => {
  const { eligibilityData, setCurrentContent, setVestingPlan, walletAddress } =
    useClaimPage();
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const { claimTokens } = useClaim();

  const formMethods = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const [vestingPlan] = formMethods.watch(['vestingPlan']);

  const isOwnerOfCheckedWallet = useMemo(() => {
    return (
      walletClient?.account.address.toLowerCase() ===
      walletAddress?.toLowerCase()
    );
  }, [walletClient, walletAddress]);

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
    if (isConnected) {
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
    } else {
      return 'LOG IN';
    }
  }, [isConnected, vestingPlan]);

  if (!eligibilityData) {
    setCurrentContent('check-eligibility');
    return;
  }

  return (
    <>
      <TxLoadingModal
        show={claimTokens.isPending}
        heading={
          <TxLoadingHeading
            amount={formatEther(BigInt(eligibilityData.claimData.amount))}
            vestingPlan={vestingPlan}
          />
        }
      />

      <div className="relative z-[5] mb-6 flex w-[800px] flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
        <GradientBorder
          borderWidth={1}
          gradientDirection="toTop"
          gradientStopColor="rgba(145, 206, 154, 0.50)"
        />

        <div className="flex w-[485px] flex-col gap-4">
          <p className="mb-2 text-label3 text-neutralGreen-700">
            SELECT YOUR PLAN
          </p>

          <Form className="mb-2 w-full">
            <Controller
              name="vestingPlan"
              control={formMethods.control}
              rules={{
                required: 'vesting plan is required',
              }}
              render={({ field }) => {
                return <RadioGroup {...field} items={vestingPlanOptions} />;
              }}
            />
          </Form>

          <span className="block w-full border-t border-mint-200 opacity-50" />

          <div className="flex w-full flex-row items-center">
            <Controller
              name="termsChecked"
              control={formMethods.control}
              render={({ field }) => {
                return (
                  <Checkbox
                    {...field}
                    rootClassName="border-neutral-300"
                    label={
                      <span className="w-full text-body5 text-neutralGreen-900">
                        By claiming, you agree to the{' '}
                        <Link
                          isExternal
                          size="medium"
                          className="text-body5 lg:text-body5"
                          href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                        >
                          Terms{'\u00A0'}and{'\u00A0'}conditions
                        </Link>
                      </span>
                    }
                  />
                );
              }}
            />
          </div>

          <GeoConditionalButton
            defaultButton={
              <Button
                size="large"
                intent="primary"
                className="w-full"
                onClick={async () => {
                  setVestingPlan(vestingPlan);
                  await claimTokens.use({ vestingPlan });
                }}
                disabled={
                  !formMethods.watch('termsChecked') ||
                  (isConnected && !isOwnerOfCheckedWallet)
                }
              >
                {vestingPlanButtonLabel}
              </Button>
            }
          />

          {isConnected && !isOwnerOfCheckedWallet && (
            <div className="flex items-center justify-center text-label6 text-red-500">
              <Icon name="AlertCircle" size={16} className="pr-1.5" /> Please
              connect the eligible wallet to claim
            </div>
          )}
        </div>

        <span className="mx-10 block w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />

        <div className="flex w-[389px] flex-col">
          <div className="flex flex-col gap-2">
            <p className="pb-4 text-label3 text-neutralGreen-700">
              VAULT BENEFITS
            </p>

            <div className="flex gap-2">
              <Icon size={24} name="PiggyBank" className="text-gray-300" />
              <p className="text-body3 text-neutralGreen-700">
                Earn <span className="gradient-text">12% APR</span> on locked
                tokens
              </p>
            </div>

            <div className="flex gap-2.5">
              <Icon
                size={24}
                name="Gem"
                className="ml-[2px] size-[38px] text-gray-300"
              />

              <p className="text-body3 text-neutralGreen-700">
                Lock <span className="gradient-text">10,000 $IDRISS</span> or
                more to access premium features
              </p>
            </div>

            <div className="flex gap-2.5">
              <Icon
                size={24}
                name="PieChart"
                className="ml-[3px] size-[36px] text-gray-300"
              />

              <p className="text-body3 text-neutralGreen-700">
                Tap into decentralized revenue sharing from IDRISS apps
              </p>
            </div>
          </div>

          <Button
            asLink
            isExternal
            size="medium"
            intent="tertiary"
            href={VAULT_DOCS_LINK}
            className="mt-8 w-full"
            suffixIconName="IdrissArrowRight"
          >
            LEARN MORE
          </Button>
        </div>
      </div>
    </>
  );
};

const TxLoadingHeading = ({
  amount,
  vestingPlan,
}: TxLoadingHeadingParameters) => {
  const amountDependingOnVestingPlan =
    vestingPlan === 'claim_and_stake_100' ? Number(amount) * 2 : Number(amount);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountDependingOnVestingPlan);

  return (
    <>
      Claiming <span className="text-mint-600">{formattedAmount}</span> IDRISS
    </>
  );
};
