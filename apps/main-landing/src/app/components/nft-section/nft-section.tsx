'use client';

import { classes } from '@idriss-xyz/ui/utils';
import { Button } from '@idriss-xyz/ui/button';
import { CREATORS_NFT_DONATIONS_X_POST } from '@idriss-xyz/constants';

import { useBrowserBasedImage } from '@/app/hooks/use-browser-based-image';

import { NFTS_SVG, NFTS_PNG } from './assets';

export const NftSection = () => {
  const imageSrc = useBrowserBasedImage({
    svgSrc: NFTS_SVG.src,
    pngSrc: NFTS_PNG.src,
  });

  return (
    <section className="relative bg-mint-100">
      <div className="relative overflow-hidden">
        <div className="z-1 py-10 px-safe lg:pb-20 lg:pt-[60px]">
          <div className="container relative grid items-center gap-x-8 gap-y-4 lg:grid-cols-[1fr,1fr]">
            <div className="flex w-full flex-col items-center gap-4 lg:items-start">
              <h2
                className={classes(
                  'w-full whitespace-pre-wrap text-display5 uppercase gradient-text',
                  'sm:text-center md:text-display4',
                  'lg:whitespace-pre-wrap lg:text-left lg:text-display3',
                )}
              >
                The first NFT donations for streamers
              </h2>

              <p
                className={classes(
                  'text-body2 text-neutralGreen-900 opacity-70 sm:text-center lg:text-balance lg:text-left',
                )}
              >
                Let your viewers show appreciation in a whole new way. Start
                receiving in-game assets such as cards, skins, and weapons from
                your favorite games. All these items are digital collectibles
                (NFTs) you can truly own and trade.
              </p>

              <Button
                asLink
                isExternal
                size="large"
                intent="secondary"
                href={CREATORS_NFT_DONATIONS_X_POST}
                suffixIconName="IdrissArrowRight"
                className="uppercase"
              >
                Learn more
              </Button>
            </div>

            <div className="relative mx-auto mb-px rounded-[24px] px-2 py-10 lg:p-6">
              <img alt="" className="w-full" src={imageSrc} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
