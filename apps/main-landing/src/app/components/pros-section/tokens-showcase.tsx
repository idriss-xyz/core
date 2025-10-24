import { Marquee } from '@idriss-xyz/ui/marquee';
import { classes } from '@idriss-xyz/ui/utils';

import {
  AAVEGOTCHI,
  AXIE,
  DAI,
  DEGEN,
  ETH,
  IDRISS,
  PARAGONS,
  PENGU,
  PRIME,
  RONIN,
  USDC,
  YIELD,
} from './assets';

type Properties = {
  className?: string;
};

const tokens = [
  {
    name: 'Idriss',
    image: IDRISS.src,
  },
  {
    name: 'Eth',
    image: ETH.src,
  },
  {
    name: 'Usdc',
    image: USDC.src,
  },
  {
    name: 'Dai',
    image: DAI.src,
  },
  {
    name: 'Aavegotchi',
    image: AAVEGOTCHI.src,
  },
  {
    name: 'Prime',
    image: PRIME.src,
  },
];

const tokens2 = [
  {
    name: 'Yield Guild Games',
    image: YIELD.src,
  },
  {
    name: 'Ronin',
    image: RONIN.src,
  },
  {
    name: 'Axie',
    image: AXIE.src,
  },
  {
    name: 'ParagonsDAO',
    image: PARAGONS.src,
  },
  {
    name: 'Degen',
    image: DEGEN.src,
  },
  {
    name: 'Pengu',
    image: PENGU.src,
  },
];

export const TokensShowcase = ({ className }: Properties) => {
  return (
    <div
      className={classes(
        'z-1 flex w-full flex-col items-center justify-center gap-4 lg:gap-8',
        className,
      )}
    >
      <Marquee
        gap="md"
        sideBlurVariant="side-blur-2"
        className="container w-full lg:side-blur"
        items={tokens.map((token, index) => {
          return (
            <img
              alt=""
              src={token.image}
              className="block size-[60px]"
              key={`token-showcase-${token.name}-${index}`}
            />
          );
        })}
      />

      <Marquee
        gap="md"
        sliderClassName="ml-[60px]"
        sideBlurVariant="side-blur-2"
        className="container w-full lg:side-blur"
        items={tokens2.map((token, index) => {
          return (
            <img
              alt=""
              src={token.image}
              className="block size-[60px]"
              key={`token-showcase-${token.name}-${index}`}
            />
          );
        })}
      />
    </div>
  );
};
