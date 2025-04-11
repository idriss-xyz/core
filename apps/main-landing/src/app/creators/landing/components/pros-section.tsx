/* eslint-disable @next/next/no-img-element */
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { TokensShowcase } from '@/app/creators/landing/components/pros-section/tokens-showcase';
import { DONORS_LEADERBOARD, FEE_CHART } from '@/app/creators/landing/assets';

import { ProsItem } from './pros-section/pros-item';

export const ProsSection = () => {
  return (
    <section className="relative">
      <div className="bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] py-10 px-safe lg:py-20">
        <div className="container relative flex flex-col items-start gap-y-10 lg:gap-y-20">
          <div className="flex w-full flex-col items-center gap-2">
            <h2
              className={classes(
                'text-center text-display5 uppercase text-midnightGreen-100',
                'md:text-display4',
                'lg:text-display3',
              )}
            >
              WHY CREATORS CHOOSE IDRISS
            </h2>

            <p
              className={classes(
                'text-center text-body3 text-midnightGreen-200 lg:text-balance',
              )}
            >
              More earnings, more ways to get paid, and more reasons for your
              fans to keep coming back.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 lg:gap-6">
            <div className="relative grid items-center gap-x-8 gap-y-4 overflow-hidden rounded-[24px] p-4 py-8 pb-0 lg:grid-cols-[1fr,1fr] lg:p-8">
              <ProsItem
                iconName="TrendingUp"
                heading="More revenue, less fees"
                description="Stop losing a significant portion of your earnings to transaction fees and platform cuts. With IDRISS, you keep more of what you earn and offer your supporters a smooth, borderless way to contribute."
              />

              <img
                alt=""
                src={FEE_CHART.src}
                className="ml-[calc((100%-680px)/2)] w-[600px] max-w-fit object-contain sm:mx-auto sm:w-full"
              />

              <GradientBorder
                borderWidth={1}
                borderRadius={24}
                gradientDirection="toBottom"
                gradientStartColor="rgba(210,248,93,0.4)"
                gradientStopColor="rgba(197, 239, 67, 0.2)"
              />
            </div>

            <div className="flex w-full flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-6">
              <div className="relative flex flex-col items-start rounded-[24px] p-4 py-8 lg:p-8">
                <ProsItem
                  iconName="HandCoins"
                  heading="More ways to donate"
                  description="Let your supporters contribute in the way that suits them best. Accept payments in a variety of top cryptocurrencies."
                >
                  <TokensShowcase className="my-16" />
                </ProsItem>

                <GradientBorder
                  borderWidth={1}
                  borderRadius={24}
                  gradientDirection="toBottom"
                  gradientStartColor="rgba(210,248,93,0.4)"
                  gradientStopColor="rgba(197, 239, 67, 0.2)"
                />
              </div>

              <div className="relative flex flex-col items-start gap-y-10 rounded-[24px] p-4 py-8 lg:gap-y-8 lg:p-8">
                <ProsItem
                  iconName="Trophy"
                  heading="More fun and recognition"
                  description="Give your fans a reason to show up and give more. With donation alerts and leaderboards you engage and recognize your loyal supporters."
                />

                <img
                  alt=""
                  src={DONORS_LEADERBOARD.src}
                  className="mx-auto -mb-8 mt-auto w-full max-w-[300px]"
                />

                <GradientBorder
                  borderWidth={1}
                  borderRadius={24}
                  gradientDirection="toBottom"
                  gradientStartColor="rgba(210,248,93,0.4)"
                  gradientStopColor="rgba(197, 239, 67, 0.2)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
