/* eslint-disable @next/next/no-img-element */
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';

import { TokensShowcase } from '@/app/creators/landing/components/pros-section/tokens-showcase';
import { DONORS_LEADERBOARD, FEE_CHARTS } from '@/app/creators/landing/assets';

import { ProsItem } from './pros-section/pros-item';

export const ProsSection = () => {
  return (
    <section className="relative">
      <div className="bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] py-10 px-safe lg:py-[80px]">
        <div className="container relative">
          <div className="mb-10 flex w-full flex-col items-center gap-2 lg:mb-20">
            <h2
              className={classes(
                'text-center text-display5 uppercase text-midnightGreen-100',
                'md:text-display4',
                'lg:text-display3',
              )}
            >
              Why idriss creators
            </h2>

            <p
              className={classes(
                'text-balance text-center text-body5 text-midnightGreen-200',
                'md:text-body4',
                'lg:text-body3',
              )}
            >
              Get instant donations of your favorite cryptos directly to your
              wallet on Twitch, YouTube, and more
            </p>
          </div>

          <div className="mb-10 flex flex-col gap-6 lg:mb-20">
            <div className="relative grid items-center gap-6 rounded-[24px] p-8 lg:grid-cols-[1fr,1fr]">
              <ProsItem
                iconName="SwitchCamera"
                heading="More revenue, less fees"
                description="Traditional payment systems take a significant portion of your
                  earnings in transaction fees, platform cuts, and currency
                  conversion charges. With crypto donations via IDRISS, you keep
                  more of what you earn while providing your supporters with a
                  seamless, borderless way to contribute."
                className="items-start"
                headingClassName="max-w-[500px] text-heading4 md:text-heading3 lg:text-heading2"
                descriptionClassName="max-w-[500px]"
              />

              <img src={FEE_CHARTS.src} className="w-full" alt="" />

              <GradientBorder
                borderWidth={1}
                borderRadius={24}
                gradientDirection="toBottom"
                gradientStartColor="rgba(210,248,93,0.4)"
                gradientStopColor="rgba(197, 239, 67, 0.2)"
              />
            </div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
              <div className="relative flex flex-col items-start gap-6 rounded-[24px] p-8">
                <ProsItem
                  iconName="Repeat2"
                  heading="More ways to donate"
                  description="Let your supporters contribute in the way that suits them
                    best. Accept payments in various cryptocurrencies without
                    limitations."
                  className="items-start"
                  headingClassName="max-w-[500px] text-heading4 md:text-heading3 lg:text-heading2"
                  descriptionClassName="max-w-[500px]"
                >
                  <TokensShowcase className="mt-16" />
                </ProsItem>

                <GradientBorder
                  borderWidth={1}
                  borderRadius={24}
                  gradientDirection="toBottom"
                  gradientStartColor="rgba(210,248,93,0.4)"
                  gradientStopColor="rgba(197, 239, 67, 0.2)"
                />
              </div>

              <div className="relative flex flex-col items-start gap-6 rounded-[24px] p-8">
                <ProsItem
                  iconName="HandCoins"
                  heading="A donor leaderboard"
                  description="Engage your audience with a ranking system that rewards top
                    supporters and encourages more contributions."
                  className="items-start"
                  headingClassName="max-w-[500px] text-heading4 md:text-heading3 lg:text-heading2"
                  descriptionClassName="max-w-[500px]"
                />

                <img
                  src={DONORS_LEADERBOARD.src}
                  className="mx-auto -mb-8 mt-8 w-full max-w-[300px]"
                  alt=""
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

          <div className="mx-auto grid w-max max-w-full gap-[70px] lg:grid-cols-[auto,auto,auto]">
            <ProsItem
              iconName="Governance"
              heading="Personalization"
              description="Let your supporters contribute in the way that suits them best.
                Accept payments in various"
            />

            <ProsItem
              iconName="GlobeIcon"
              heading="Borderless & instant transactions"
              description="Receive donations from anywhere in the world without banking
                restrictions, chargebacks"
            />

            <ProsItem
              iconName="DollarSign"
              heading="Full ownership & decentralization"
              description="No more relying on third-party platforms that can restrict or
                ban your earnings."
            />
          </div>
        </div>
      </div>
    </section>
  );
};
