/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { useState } from 'react';
import { Link } from '@idriss-xyz/ui/link';

import idrissCoin from '../../assets/IDRISS_COIN 1.png';
import { useClaimPage } from '../../claim-page-context';

import { CopyAddressButton } from './copy-address-button';
import { ExpandableInfo } from './expandable-info';

import { encodeFunctionData} from 'viem';
import { baseSepolia } from 'viem/chains';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { CLAIM_ABI, CLAIM_PAGE_ROUTE, claimContractAddress } from '../../constants';
import { useWalletClient, useWriteContract } from 'wagmi';

export const ClaimContent = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const { eligibilityData, walletAddress, navigate } = useClaimPage();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  if (!eligibilityData) {
    navigate(CLAIM_PAGE_ROUTE.CHECK_ELIGIBILITY);
    return;
  }

  if (!walletClient || walletAddress === undefined) {
    console.error("Wallet not connected")
    return;
  }

  const handleClaim = async () => {

    try {
      const claimData = {
        abi: CLAIM_ABI,
        functionName: 'claim',
        args: [
          walletClient.account.address,
          eligibilityData.claimData.amount,
          eligibilityData.claimData.claimIndices,
          eligibilityData.claimData.signature,
          eligibilityData.claimData.expiry,
          `0x${Buffer.from(eligibilityData.claimData.memo, 'utf8').toString('hex')}`
        ],
      };
      const encodedClaimData = encodeFunctionData(claimData);

      const gas = await estimateGas(walletClient, {
        to: claimContractAddress,
        data: encodedClaimData,
      }).catch((error) => {
        console.error('Error estimating gas:', error.message);
        throw error;
      });

      const hash = await writeContractAsync({
        address: claimContractAddress,
        chain: baseSepolia,
        ...claimData,
        gas
      });

      const { status } = await waitForTransactionReceipt(walletClient, { hash });

      if (status === 'reverted') {
        throw new Error('Claim transaction reverted');
      }

      return navigate(CLAIM_PAGE_ROUTE.VESTING_PLANS);
    } catch (error) {
      console.error('Error claiming:', error);
      throw error;
    }
  };
  return (
    <div className="z-[5] inline-flex flex-col items-center gap-[78px] overflow-hidden px-4 pb-3 lg:mt-[78px] lg:[@media(max-height:800px)]:mt-[60px]">
      <img className="size-[137px]" src={idrissCoin.src} alt="" />
      <div className="relative flex flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-[40px_40px_60px_40px] backdrop-blur-[45px]">
        <GradientBorder
          gradientDirection="toTop"
          gradientStopColor="rgba(145, 206, 154, 0.50)"
          borderWidth={1}
        />
        <div className="flex w-[459px] flex-col">
          <div className="flex flex-col items-start gap-10">
            <span className="text-heading3">YOU’RE ELIGIBLE</span>
            <span className="text-body3 text-neutralGreen-700">
              YOU WILL RECEIVE
            </span>
          </div>

          <div className="relative mb-10 mt-2 flex w-full flex-col items-start gap-2 self-stretch rounded-[25px] bg-[rgba(255,255,255,0.2)] p-6">
            <GradientBorder
              gradientDirection="toBottom"
              gradientStopColor="rgba(145, 206, 154)"
              gradientStartColor="#ffffff"
              borderWidth={1}
            />
            <span className="flex text-heading2 gradient-text">
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              }).format(Number(eligibilityData.allocation ?? 0))}{' '}
              $IDRISS
            </span>
            <div className="flex flex-row gap-2">
              <CopyAddressButton />
            </div>
          </div>

          <div className="mb-4 flex w-full flex-row items-center">
            <Checkbox
              onChange={setTermsChecked}
              value={termsChecked}
              rootClassName="border-neutral-300"
              label={
                <span className="ml-2 w-full text-body5 text-neutralGreen-900">
                  By participating, you agree to the{' '}
                </span>
              }
            />
            <Link
              size="medium"
              href=""
              isExternal
              className="text-body5 lg:text-body5"
            >
              Terms{'\u00A0'}and{'\u00A0'}conditions
            </Link>
          </div>
          <Button
            intent="primary"
            size="large"
            className="w-full"
            onClick={handleClaim}
            disabled={!termsChecked}
          >
            CLAIM YOUR $IDRISS
          </Button>
        </div>
        <div className="mx-10 h-[434px] w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />
        <div className="flex w-[389px] flex-col">
          <div className="flex flex-col gap-4">
            <span className="text-label2 text-neutralGreen-700">
              ELIGIBILITY CRITERIA
            </span>
            <ExpandableInfo
              title="REGISTERED IDRISS"
              subTitle={`${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                Number(eligibilityData.allocation_registrations ?? 0),
              )} IDRISS`}
              description={
                `You have registered` +
                (eligibilityData.paid
                  ? ` ${eligibilityData.paid} paid account${eligibilityData.paid > 1 ? 's' : ''}`
                  : '') +
                (eligibilityData.paid && eligibilityData.free ? ' and' : '') +
                (eligibilityData.free
                  ? ` ${eligibilityData.free} free account${eligibilityData.free > 1 ? 's' : ''}`
                  : '')
              }
            />
            <ExpandableInfo
              title="BROWSER EXTENSION USER"
              subTitle={`${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                Number(eligibilityData.allocation_extension ?? 0),
              )} IDRISS`}
              description="You have made at least 1 transaction"
            />
            <ExpandableInfo
              title="EARLY USER MULTIPLIER"
              subTitle={`x ${eligibilityData.time_multiplier}`}
              description={`You have registered on ${new Intl.DateTimeFormat(
                'en-US',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                },
              ).format(new Date(eligibilityData.registration))}`}
            />
            <ExpandableInfo
              title="REFERRAL MULTIPLIER"
              subTitle={`x ${eligibilityData.invite_multiplier}`}
              description={`You have invited ${eligibilityData.invites} members`}
            />
            <ExpandableInfo
              title="GITCOIN DONOR"
              subTitle={`${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                Number(eligibilityData.allocation_gitcoin ?? 0),
              )} IDRISS`}
              description={`You have invited ${eligibilityData.invites} members`}
            />
            <ExpandableInfo
              title="PARTNER COMMUNITY"
              subTitle={`${new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                Number(eligibilityData.allocation_partner ?? 0),
              )} IDRISS`}
              description="You are an active member of Parallel"
            />
          </div>
          <div className="mt-4 h-px w-[389px] bg-[var(--Colors-Border-border-onsurface-primary,#E7FED8)] opacity-50" />
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
