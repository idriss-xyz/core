'use client';

import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import dynamic from 'next/dynamic';
import { Link } from '@idriss-xyz/ui/link';

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
    <div className="relative z-1" id="dao">
      <div className="container flex flex-col items-center justify-center py-10 lg:py-[143px]">
        <div className="flex flex-col items-center">
          <h2 className="text-heading3 gradient-text lg:text-display3">
            TOKEN SALE
          </h2>
          <p className="mt-4 text-balance text-center text-body3 text-neutralGreen-900 opacity-70 lg:text-body2">
            IDRISS is the utility token powering{'\u00A0'}the IDRISS{'\u00A0'}
            DAO,
            <br className="hidden lg:block" /> giving you access{'\u00A0'}to
            decentralized{'\u00A0'}revenue sharing, governance rights, and more.
          </p>
          {/* Mobile */}
          <div className="mb-4 flex flex-row justify-center gap-6 lg:hidden">
            <Button
              intent="tertiary"
              size="medium"
              suffixIconName="IdrissArrowRight"
              asLink
              href=""
              isExternal
            >
              FAQ
            </Button>
            <Button
              intent="tertiary"
              size="medium"
              suffixIconName="IdrissArrowRight"
              asLink
              href=""
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
              href=""
              isExternal
            >
              FAQ
            </Button>
            <Button
              intent="tertiary"
              size="large"
              suffixIconName="IdrissArrowRight"
              asLink
              href=""
              isExternal
            >
              TOKENOMICS
            </Button>
          </div>
          <div className="relative flex flex-col items-center gap-[40px] rounded-[36px] bg-white/50 px-4 py-10 backdrop-blur-[45px] lg:w-[893px] lg:px-[54px] lg:py-[60px]">
            <GradientBorder
              borderRadius={36}
              borderWidth={1}
              gradientDirection="toTop"
              gradientStartColor="#5FEB3C"
              gradientStopColor="rgba(145,206,154,0.50)"
            />
            {/* <ImageSequencer
              images={tokenCoinImages}
              className="size-[164px] lg:mb-2.5 lg:size-[200px]"
            /> */}
            <Image
              priority
              src={idrissCoin}
              alt="IDRISS coin"
              className="size-[164px] lg:mb-2.5 lg:size-[200px]"
            />
            <div className="flex w-full flex-wrap justify-between gap-2">
              <LabeledGradientProperty
                label="TOKEN"
                content="IDRISS"
                additionalContent={<CopyAddressButton />}
                className="mb-8 w-full lg:mb-0 lg:w-fit"
              />
              <LabeledGradientProperty label="FOR SALE" content="5%" />
              <LabeledGradientProperty label="FDV" content="$30M" />
              <LabeledGradientProperty label="PRICE" content="$0.03" />
            </div>
            <TokenSaleCountdown />
            <div className="flex flex-col gap-6 lg:gap-4">
              <div className="flex flex-col gap-6 lg:flex-row">
                <Button
                  intent="primary"
                  size="large"
                  prefixIconName="Uniswap"
                  asLink
                  href=""
                  isExternal
                  className="w-full lg:w-auto"
                >
                  BUY ON UNISWAP
                </Button>
                <Button
                  intent="primary"
                  size="large"
                  prefixIconName="Jumper"
                  asLink
                  href=""
                  isExternal
                  className="w-full whitespace-nowrap lg:w-auto"
                >
                  BUY CROSS-CHAIN ON JUMPER
                </Button>
              </div>
              <div className="self-stretch text-center opacity-70">
                <span className="text-body4 text-neutralGreen-900 lg:text-body2">
                  By participating, you agree to the{' '}
                </span>
                <Link size="medium" href="" isExternal className='text-body4 lg:text-body2'>
                  Terms{'\u00A0'}and{'\u00A0'}conditions
                </Link>
              </div>
            </div>
          </div>
          <Image
            src={background}
            className="pointer-events-none absolute left-0 top-0 -z-1 size-full overflow-visible object-cover"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
