/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { classes } from '@idriss-xyz/ui/utils';
import { AIRDROP_DOCS_LINK, COINMARKETCAP_LINK } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';

import { GeoConditionalButton } from '@/components/token-section/components/geo-conditional-button';

import { useClaimPage } from '../../claim-page-context';

import { ExpandableInfo } from './components/expandable-info';
import {
  ELIGIBILITY_CRITERIA_TITLES,
  EligibilityCriteriaTitle,
} from './constants';
import { IdrissUserCriteriaDescription } from './components/idriss-user-criteria-description';
import { PartnerMemberDescription } from './components/partner-member-description';

export const ClaimContent = () => {
  const { eligibilityData, setCurrentContent } = useClaimPage();
  const [expandedItemTitle, setExpandedItemTitle] = useState<
    EligibilityCriteriaTitle | undefined
  >('IDRISS USER');

  const liBaseClassName =
    "relative flex justify-between pr-1 before:absolute before:-left-4 before:text-red-500 before:content-['•']";

  if (!eligibilityData) {
    setCurrentContent('check-eligibility');
    return;
  }

  return (
    <div className="relative z-[5] flex w-[1000px] flex-row rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <div className="flex w-[459px] flex-col">
        <div className="flex flex-col items-start gap-10">
          <span className="text-heading3">YOU’RE ELIGIBLE!</span>
          <span className="text-body3 text-neutralGreen-700">
            TOKENS TO CLAIM
          </span>
        </div>

        <div className="relative mb-10 mt-2 flex w-full flex-col items-start gap-4 self-stretch rounded-[25px] bg-[rgba(255,255,255,0.2)] p-6">
          <GradientBorder
            gradientDirection="toBottom"
            gradientStopColor="rgba(145, 206, 154)"
            gradientStartColor="#ffffff"
            borderWidth={1}
          />
          <div className="flex gap-4">
            <span className="flex text-heading2 gradient-text">
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(eligibilityData.allocation ?? 0))}{' '}
              $IDRISS
            </span>
            <div className="relative">
              <Icon name="IdrissCircled" size={48} />
              <Icon
                name="BaseLogo"
                size={24}
                className="absolute bottom-0 right-0 translate-x-1"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              intent="secondary"
              size="small"
              className="w-full"
              asLink
              prefixIconName="Coinmarketcap"
              isExternal
              href={COINMARKETCAP_LINK}
            >
              VIEW ON COINMARKETCAP
            </Button>
          </div>
        </div>
        <GeoConditionalButton
          defaultButton={
            <Button
              intent="primary"
              size="large"
              className="w-full"
              onClick={() => {
                return setCurrentContent('vesting-plans');
              }}
            >
              CLAIM $IDRISS
            </Button>
          }
        />
      </div>
      <div className="mx-10 h-[434px] w-px bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50" />
      <div className="flex w-[389px] flex-col">
        <div className="flex flex-col gap-4 lg:min-h-[337px]">
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
                rounds{'\u00A0'}between GR15 and GG20
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
                You purchased IDRISS within the first 12{'\u00A0'}hours of
                {'\u00A0'}the{'\u00A0'}sale and held it for 2 weeks
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
          href={AIRDROP_DOCS_LINK}
        >
          LEARN MORE
        </Button>
      </div>
    </div>
  );
};
