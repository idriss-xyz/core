'use client';
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { useBrowserBasedImage } from '@/app/hooks/use-browser-based-image';

import { TokensShowcase } from './pros-section/tokens-showcase';
import { ProsItem } from './pros-section/pros-item';
import {
  CREATORS_DONATE_1_PNG,
  CREATORS_DONATE_1_SVG,
  CREATORS_DONATE_2_PNG,
  CREATORS_DONATE_2_SVG,
  DONORS_LEADERBOARD_PNG,
  DONORS_LEADERBOARD_SVG,
  FEE_CHART,
} from './pros-section/assets';

export const ProsSection = () => {
  const [direction, setDirection] = useState(1);
  const [activeWrapper, setActiveWrapper] = useState(0);

  const donorsLeaderboardSrc = useBrowserBasedImage({
    svgSrc: DONORS_LEADERBOARD_SVG.src,
    pngSrc: DONORS_LEADERBOARD_PNG.src,
  });

  const creatorsDonate1Src = useBrowserBasedImage({
    svgSrc: CREATORS_DONATE_1_SVG.src,
    pngSrc: CREATORS_DONATE_1_PNG.src,
  });

  const creatorsDonate2Src = useBrowserBasedImage({
    svgSrc: CREATORS_DONATE_2_SVG.src,
    pngSrc: CREATORS_DONATE_2_PNG.src,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWrapper((previous) => {
        const next = previous === 0 ? 1 : 0;

        setDirection(next > previous ? 1 : -1);

        return next;
      });
    }, 6000);

    return () => {
      return clearInterval(interval);
    };
  }, []);

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
      };
    },
  };

  return (
    <section className="relative">
      <div className="bg-[linear-gradient(114deg,_#022B1E_34.81%,_#079165_123.57%)] py-10 px-safe lg:py-20">
        <div className="container relative flex flex-col items-start gap-y-10 lg:gap-y-20">
          <div className="flex w-full flex-col items-center gap-2">
            <h2
              className={classes(
                'whitespace-pre-wrap text-center text-display5 uppercase text-midnightGreen-100',
                'sm:whitespace-nowrap md:text-display4',
                'lg:text-display3',
              )}
            >
              Why streamers
              {'\n'}choose Idriss
            </h2>

            <p
              className={classes(
                'text-center text-body3 text-midnightGreen-200 lg:text-balance',
              )}
            >
              More earnings, more ways to get paid, more reasons for your fans
              to keep coming back.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 lg:gap-6">
            <div className="relative flex flex-col gap-y-4 overflow-hidden rounded-[24px] p-4 py-8 pb-0 lg:grid lg:grid-cols-[1fr,1fr] lg:items-center lg:gap-x-8 lg:p-8">
              <ProsItem
                iconName="TrendingUp"
                heading="More revenue, less fees"
                description="Stop losing a significant portion of your earnings to transaction fees and platform cuts. With IDRISS, you keep more of what you earn and offer your supporters a smooth, borderless way to contribute."
              />

              <img
                alt=""
                src={FEE_CHART.src}
                className="mx-auto w-full max-w-[600px] object-contain"
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
                  innerClassName="max-w-[490px]"
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

              <div className="relative flex flex-col items-start gap-y-10 overflow-hidden rounded-[24px] p-4 py-8 lg:gap-y-8 lg:p-8">
                <ProsItem
                  iconName="Trophy"
                  heading="More fun and recognition"
                  description="Give your fans a reason to show up and give more. With donation alerts and leaderboards you engage and recognize your loyal supporters."
                />

                <div className="mt-auto min-h-[248.33px] w-full">
                  <AnimatePresence
                    custom={direction}
                    initial={false}
                    mode="wait"
                  >
                    {activeWrapper === 0 ? (
                      <motion.div
                        exit="exit"
                        key="wrapper1"
                        initial="enter"
                        animate="center"
                        custom={direction}
                        variants={slideVariants}
                        style={{ willChange: 'transform' }}
                        className="-mb-8 mt-auto flex w-full"
                      >
                        <img
                          alt=""
                          src={donorsLeaderboardSrc}
                          className="mx-auto w-full max-w-[297px]"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        exit="exit"
                        key="wrapper2"
                        initial="enter"
                        animate="center"
                        custom={direction}
                        variants={slideVariants}
                        style={{ willChange: 'transform' }}
                        className="mt-auto flex min-h-[248.33px] w-full flex-col items-center justify-center gap-y-5"
                      >
                        <img
                          alt=""
                          src={creatorsDonate1Src}
                          className="ml-5 w-max max-w-full sm:ml-auto sm:max-w-[430px]"
                        />

                        <img
                          alt=""
                          src={creatorsDonate2Src}
                          className="mr-5 w-max max-w-full sm:mr-auto sm:max-w-[430px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
