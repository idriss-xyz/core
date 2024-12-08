'use client';

import { Button } from '@idriss-xyz/ui/button';
import Image from 'next/image';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import dynamic from 'next/dynamic';
import { Link } from '@idriss-xyz/ui/link';

import { ImageSequencer } from '../image-sequencer';

import background from './background.png';
import { LabeledGradientProperty } from './components';

const TOKEN_COIN_BASE_NAME = `spining-token-coin-optimized/IDRISS_COIN_`;
const TOKEN_COIN_IMAGES_COUNT = 91;
const tokenCoinImages = [
  ...Array.from({ length: TOKEN_COIN_IMAGES_COUNT }).keys(),
].map((_, index) => {
  return `${TOKEN_COIN_BASE_NAME}${index.toString().padStart(4, '0')}.webp`;
});

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
      <div className="container flex justify-center py-10 lg:py-[84px]">
        <div className="relative flex flex-col items-center gap-[60px] rounded-[36px] bg-white/50 px-4 py-10 backdrop-blur-[45px] lg:w-[854px] lg:px-[54px] lg:py-20">
          <GradientBorder
            borderRadius={36}
            borderWidth={1}
            gradientDirection="toTop"
            gradientStartColor="#5FEB3C"
            gradientStopColor="rgba(145,206,154,0.50)"
          />
          <div className="flex max-w-[746px] flex-col items-center gap-4">
            <ImageSequencer
              images={tokenCoinImages}
              className="size-[88px] lg:size-[200px]"
            />
            <h2 className="text-display6 gradient-text lg:text-display3">
              TOKEN SALE
            </h2>
            <p className="text-center text-body3 text-neutralGreen-900 opacity-70 lg:text-body2">
              IDRISS is the utility token powering the IDRISS DAO, <br />
              giving you access to decentralized revenue sharing, governance
              rights, and more.
            </p>
            <div className="flex flex-row gap-6">
              <Button
                intent="tertiary"
                size="large"
                suffixIconName="IdrissArrowRight"
                asLink
                href=""
                isExternal
              >
                LEGAL TERMS
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
          </div>
          <div className="flex gap-10">
            <LabeledGradientProperty
              label="TOKEN"
              content="IDRISS"
              additionalContent={<CopyAddressButton />}
            />
            <LabeledGradientProperty label="ALLOCATION" content="50M" />
            <LabeledGradientProperty label="PRICE PER TOKEN" content="$0.03" />
          </div>
          <TokenSaleCountdown />
          <div className="flex flex-col gap-4">
            <div className="flex gap-6">
              <Button
                intent="primary"
                size="large"
                prefixIconName="Uniswap"
                asLink
                href=""
                isExternal
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
              >
                BUY ON JUMPER
              </Button>
            </div>
            <div className="self-stretch text-center opacity-70">
              <span className="text-body2 text-neutralGreen-900">
                By participating, you agree to the{' '}
              </span>
              <Link size="medium" href="" isExternal>
                Terms and Conditions
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={background}
          className="pointer-events-none absolute left-0 top-0 -z-1 overflow-visible lg:size-full lg:object-cover"
          alt=""
        />
      </div>
    </div>
  );
};
