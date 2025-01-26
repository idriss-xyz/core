/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { useState } from 'react';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';

import { useClaimPage } from '../../claim-page-context';

import { CopyAddressButton } from './components/copy-address-button';
import { ExpandableInfo } from './components/expandable-info';
import {
  ELIGIBILITY_CRITERIA_TITLES,
  EligibilityCriteriaTitle,
} from './constants';
import { IdrissUserCriteriaDescription } from './components/idriss-user-criteria-description';
import { PartnerMemberDescription } from './components/partner-member-description';

export const ClaimContent = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const { eligibilityData, setCurrentContent } = useClaimPage();
  const [expandedItemTitle, setExpandedItemTitle] =
    useState<EligibilityCriteriaTitle>();

  if (!eligibilityData) {
    setCurrentContent('check-eligibility');
    return;
  }

  const liBaseClassName =
    "relative flex justify-between pr-1 before:absolute before:-left-4 before:text-red-500 before:content-['•']";

  return (
    <div className="relative z-[5] flex w-[1000px] flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="flex w-[459px] flex-col">
        <div className="flex flex-col items-start gap-10">
          <span className="text-heading3">YOU’RE ELIGIBLE</span>
          <span className="text-body3 text-neutralGreen-700">
            TOKENS TO CLAIM
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
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
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
          onClick={() => {
            return setCurrentContent('vesting-plans');
          }}
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
            open={expandedItemTitle === ELIGIBILITY_CRITERIA_TITLES.IDRISS_USER}
            onOpenChange={() => {
              return setExpandedItemTitle((previous) => {
                return previous === ELIGIBILITY_CRITERIA_TITLES.IDRISS_USER
                  ? undefined
                  : ELIGIBILITY_CRITERIA_TITLES.IDRISS_USER;
              });
            }}
            title={ELIGIBILITY_CRITERIA_TITLES.IDRISS_USER}
            subTitle={`${new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(eligibilityData.allocation_usage ?? 0))}`}
            description={
              <IdrissUserCriteriaDescription
                eligibilityData={eligibilityData}
                liBaseClassName={liBaseClassName}
              />
            }
            positive={!!eligibilityData.allocation_usage}
          />
          <ExpandableInfo
            open={
              expandedItemTitle === ELIGIBILITY_CRITERIA_TITLES.GITCOIN_DONOR
            }
            onOpenChange={() => {
              return setExpandedItemTitle((previous) => {
                return previous === ELIGIBILITY_CRITERIA_TITLES.GITCOIN_DONOR
                  ? undefined
                  : ELIGIBILITY_CRITERIA_TITLES.GITCOIN_DONOR;
              });
            }}
            title={ELIGIBILITY_CRITERIA_TITLES.GITCOIN_DONOR}
            subTitle={`${new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(eligibilityData.allocation_gitcoin ?? 0))}`}
            description={
              <li
                className={classes(
                  liBaseClassName,
                  eligibilityData.allocation_gitcoin && 'before:text-mint-600',
                )}
              >
                You donated a total of ${eligibilityData.gitcoin} to open source
                rounds between GR15 and GG20
              </li>
            }
            positive={!!eligibilityData.allocation_gitcoin}
          />

          <ExpandableInfo
            open={
              expandedItemTitle === ELIGIBILITY_CRITERIA_TITLES.SALE_PARTICIPANT
            }
            onOpenChange={() => {
              return setExpandedItemTitle((previous) => {
                return previous === ELIGIBILITY_CRITERIA_TITLES.SALE_PARTICIPANT
                  ? undefined
                  : ELIGIBILITY_CRITERIA_TITLES.SALE_PARTICIPANT;
              });
            }}
            title={ELIGIBILITY_CRITERIA_TITLES.SALE_PARTICIPANT}
            subTitle={`${new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(eligibilityData.allocation_ido ?? 0))}`}
            description={
              <li
                className={classes(
                  liBaseClassName,
                  eligibilityData.allocation_ido && 'before:text-mint-600',
                )}
              >
                You purchased IDRISS within the first 12{'\u00A0'}hours of the
                sale and held it for 2 weeks
              </li>
            }
            positive={!!eligibilityData.allocation_ido}
          />
          <ExpandableInfo
            open={
              expandedItemTitle ===
              ELIGIBILITY_CRITERIA_TITLES.PARTNER_COMMUNITY_MEMBER
            }
            onOpenChange={() => {
              return setExpandedItemTitle((previous) => {
                return previous ===
                  ELIGIBILITY_CRITERIA_TITLES.PARTNER_COMMUNITY_MEMBER
                  ? undefined
                  : ELIGIBILITY_CRITERIA_TITLES.PARTNER_COMMUNITY_MEMBER;
              });
            }}
            title={ELIGIBILITY_CRITERIA_TITLES.PARTNER_COMMUNITY_MEMBER}
            subTitle={`${new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(eligibilityData.allocation_partner))}`}
            description={
              <PartnerMemberDescription
                eligibilityData={eligibilityData}
                liBaseClassName={liBaseClassName}
              />
            }
            positive={!!eligibilityData.allocation_partner}
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
  );
};
