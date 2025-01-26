/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { TOKEN_TERMS_AND_CONDITIONS_LINK } from '@idriss-xyz/constants';

import { useClaimPage } from '../../claim-page-context';

import idrissCoin from './assets/IDRISS_SCENE_CIRCLE_2 2.png';
import { SOCIALS } from './constants';

export const ClaimSuccessfulContent = () => {
  const { setCurrentContent, eligibilityData, vestingPlan } = useClaimPage();

  if (!eligibilityData) {
    setCurrentContent('check-eligibility');
    return;
  }

  return (
    <div className="relative z-[5] m-auto flex w-[560px] flex-col items-center gap-6 rounded-[25px] bg-[rgba(255,255,255,0.5)] p-10 backdrop-blur-[45px]">
      <GradientBorder
        gradientDirection="toTop"
        gradientStopColor="rgba(145, 206, 154, 0.50)"
        borderWidth={1}
      />
      <span className="text-heading4 text-neutral-900">CLAIM SUCCESSFUL</span>
      <div className="relative flex h-[354px] w-[480px] flex-col items-center justify-center gap-6 self-stretch overflow-hidden rounded-2xl bg-mint-100 p-6">
        <img
          alt=""
          src={idrissCoin.src}
          className="pointer-events-none absolute left-0 top-0"
        />
        <IconButton
          size="large"
          iconName="Download"
          intent="tertiary"
          iconClassName="size-6"
          onClick={() => {}}
          className="absolute right-6 top-6 flex size-6 p-0 text-midnightGreen-100"
        />
        <div className="relative flex w-full flex-row justify-center" />
        <div className="flex flex-col items-center gap-2">
          <span className="text-body4 text-neutralGreen-700">
            {vestingPlan === 'claim_50'
              ? 'YOU RECEIVED'
              : 'UNLOCK ON JULY 6, 2025'}
          </span>
          <div className="z-10 flex flex-col items-center justify-center rounded-[12px] border-[0.683px] border-[rgba(85,235,60,0.30)] bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(252,255,242,0.00)_0%,_rgba(23,255,74,0.18)_100%)] px-10 py-5.5">
            <span className="text-heading3 gradient-text">
              +
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                Number(
                  vestingPlan === 'claim_50'
                    ? (eligibilityData.allocation ?? 0) / 2
                    : (eligibilityData.allocation ?? 0),
                ),
              )}{' '}
              $IDRISS
            </span>
          </div>
        </div>
      </div>
      {vestingPlan === 'claim_50' ? (
        <Button
          asLink
          intent="primary"
          size="large"
          className="w-full"
          href="/staking"
        >
          LOCK $IDRISS FOR BENEFITS
        </Button>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <Button
            key="uniswap"
            intent="primary"
            size="large"
            prefixIconName="Uniswap"
            asLink
            href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x000096630066820566162C94874A776532705231"
            isExternal
            className="w-full"
          >
            BUY ON UNISWAP
          </Button>
          <Button
            key="jumper"
            intent="primary"
            size="large"
            prefixIconName="Jumper"
            asLink
            href="https://jumper.exchange/?fromChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toChain=8453&toToken=0x000096630066820566162C94874A776532705231"
            isExternal
            className="w-full"
          >
            BUY ON JUMPER
          </Button>
          <div className="flex w-full items-center justify-center opacity-70">
            <span
              className={classes(
                'text-body5 text-neutralGreen-900',
                'md:text-body5',
              )}
            >
              By purchasing, you agree to the{' '}
              <Link
                size="medium"
                href={TOKEN_TERMS_AND_CONDITIONS_LINK}
                isExternal
                className={classes(
                  'text-body5',
                  'md:text-body5',
                  //lg here is intentional to override the Link variant style
                  'lg:text-body5',
                )}
              >
                Terms{'\u00A0'}and{'\u00A0'}conditions
              </Link>
            </span>
          </div>
        </div>
      )}
      <div className="flex">
        {SOCIALS.map((social, index) => {
          return (
            <IconButton
              key={index}
              size="large"
              intent="tertiary"
              iconName={social.iconName}
              href={social.link}
              aria-label={social.label}
              isExternal
              asLink
            />
          );
        })}
      </div>
    </div>
  );
};
