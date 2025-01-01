/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import dynamic from 'next/dynamic';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';

import idrissCoin from './assets/IDRISS_COIN 1.png';
import background from './background.png';
import { LabeledGradientProperty } from './components';

const CopyAddressButton = dynamic(
  async () => {
    const { CopyAddressButton } = await import(
      './components/copy-address-button'
    );
    return CopyAddressButton;
  },
  { ssr: false },
);

const TokenSaleCountdown = dynamic(
  async () => {
    const { TokenSaleCountdown } = await import(
      './components/token-sale-countdown'
    );
    return TokenSaleCountdown;
  },
  { ssr: false },
);

export const TokenSection = () => {
  return (
    <div className="relative z-1 px-safe" id="dao">
      <div
        className={classes(
          'container flex flex-col items-center justify-center py-10',
          'md:py-[60px]',
          'lg:py-[116px]',
          '4xl:py-[110px]',
        )}
      >
        <div className="flex flex-col items-center">
          <h2
            className={classes(
              'text-heading3 gradient-text',
              'md:text-display4',
              'lg:text-display3',
            )}
          >
            TOKEN SALE
          </h2>
          <p
            className={classes(
              'mb-2 mt-4 text-balance text-center text-body3 text-neutralGreen-900 opacity-70',
              'lg:text-body2',
              '4xl:text-body1',
            )}
          >
            IDRISS is the utility token powering{'\u00A0'}the IDRISS{'\u00A0'}
            DAO,
            <br className="hidden lg:block" /> giving you access{'\u00A0'}to
            decentralized{'\u00A0'}revenue sharing, governance rights, and more.
          </p>
          {/* Mobile */}
          <div
            className={classes(
              'mb-3 flex flex-row justify-center gap-6',
              'md:mb-4',
              'lg:hidden',
            )}
          >
            <Button
              intent="tertiary"
              size="medium"
              suffixIconName="IdrissArrowRight"
              asLink
              href="https://docs.idriss.xyz/idriss-token/token-sale#faq"
              isExternal
            >
              FAQ
            </Button>
            <Button
              intent="tertiary"
              size="medium"
              suffixIconName="IdrissArrowRight"
              asLink
              href="https://docs.idriss.xyz/idriss-token"
              isExternal
            >
              TOKENOMICS
            </Button>
          </div>
          {/* Desktop */}
          <div className="mb-4 hidden flex-row justify-normal gap-6 lg:flex">
            <Button
              intent="tertiary"
              size="large"
              suffixIconName="IdrissArrowRight"
              asLink
              href="https://docs.idriss.xyz/idriss-token/token-sale#faq"
              isExternal
            >
              FAQ
            </Button>
            <Button
              intent="tertiary"
              size="large"
              suffixIconName="IdrissArrowRight"
              asLink
              href="https://docs.idriss.xyz/idriss-token"
              isExternal
            >
              TOKENOMICS
            </Button>
          </div>
          <div
            className={classes(
              'relative flex w-full flex-col items-center gap-[40px] rounded-[36px] bg-white/50 px-4 py-10 backdrop-blur-[45px]',
              'md:px-10 lg:w-[893px]',
              'lg:px-[54px] lg:py-[60px]',
              '2xl:w-[803px] 2xl:px-10 2xl:pb-[60px] 2xl:pt-10',
            )}
          >
            <GradientBorder
              borderRadius={36}
              borderWidth={1}
              gradientDirection="toTop"
              gradientStartColor="#5FEB3C"
              gradientStopColor="rgba(145,206,154,0.50)"
            />
            <link rel="preload" as="image" href={idrissCoin.src} />
            <img
              src={idrissCoin.src}
              alt="IDRISS coin"
              className={classes(
                'size-[164px]',
                'lg:mb-2.5 lg:size-[200px]',
                '2xl:size-[136px]',
              )}
            />
            <div className="flex w-full flex-wrap justify-between gap-2">
              <LabeledGradientProperty
                label="TOKEN"
                content="IDRISS"
                additionalContent={<CopyAddressButton />}
                className="mb-8 w-full md:w-fit lg:mb-0"
              />
              <LabeledGradientProperty label="FOR SALE" content="5%" />
              <LabeledGradientProperty label="FDV" content="$30M" />
              <LabeledGradientProperty label="PRICE" content="$0.03" />
            </div>
            <TokenSaleCountdown />
            <div className="flex flex-col gap-6 lg:gap-4">
              <div className="flex flex-col gap-6 md:flex-row">
                <Button
                  intent="primary"
                  size="large"
                  prefixIconName="Uniswap"
                  asLink
                  href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=0x000096630066820566162C94874A776532705231"
                  isExternal
                  className="w-full md:w-auto"
                >
                  BUY ON UNISWAP
                </Button>
                <Button
                  intent="primary"
                  size="large"
                  prefixIconName="Jumper"
                  asLink
                  href="https://jumper.exchange/?fromChain=8453&fromToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&toChain=8453&toToken=0x000096630066820566162C94874A776532705231"
                  isExternal
                  className="w-full whitespace-nowrap md:w-auto"
                >
                  BUY CROSS-CHAIN ON JUMPER
                </Button>
              </div>
              <div className="self-stretch text-center opacity-70">
                <span
                  className={classes(
                    'text-body4 text-neutralGreen-900',
                    'md:text-body2',
                  )}
                >
                  By participating, you agree to the{' '}
                </span>
                <Link
                  size="medium"
                  href="https://docs.idriss.xyz/idriss-token/terms-and-conditions"
                  isExternal
                  className={classes(
                    'text-body4',
                    'md:text-body2',
                    //lg here is intentional to override the Link variant style
                    'lg:text-body2',
                  )}
                >
                  Terms{'\u00A0'}and{'\u00A0'}conditions
                </Link>
              </div>
            </div>
          </div>
          <img
            src={background.src}
            className="pointer-events-none absolute left-0 top-0 -z-1 size-full overflow-visible object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
