'use client';
/* eslint-disable @next/next/no-img-element */
import { classes } from '@idriss-xyz/ui/utils';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import {
  CREATORS_DONATE_1,
  CREATORS_DONATE_2,
  DONORS_LEADERBOARD,
  FEE_CHART,
} from '../assets';

import { TokensShowcase } from './pros-section/tokens-showcase';
import { ProsItem } from './pros-section/pros-item';

export const ProsSection = () => {
  const [activeWrapper, setActiveWrapper] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWrapper((previous) => {
        return previous === 0 ? 1 : 0;
      });
    }, 5000);

    return () => {
      return clearInterval(interval);
    };
  }, []);

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
              Why creators choose Idriss
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

              <div className="relative flex flex-col items-start gap-y-10 overflow-hidden rounded-[24px] p-4 py-8 lg:gap-y-8 lg:p-8">
                <ProsItem
                  iconName="Trophy"
                  heading="More fun and recognition"
                  description="Give your fans a reason to show up and give more. With donation alerts and leaderboards you engage and recognize your loyal supporters."
                />

                <AnimatePresence initial={false} mode="wait">
                  {activeWrapper === 0 ? (
                    <motion.div
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      initial={{ x: '100%' }}
                      transition={{
                        damping: 30,
                        type: 'spring',
                        stiffness: 300,
                      }}
                      className="-mb-8 mt-auto flex w-full"
                    >
                      <img
                        alt=""
                        src={DONORS_LEADERBOARD.src}
                        className="mx-auto w-full max-w-[300px]"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wrapper2"
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      initial={{ x: '100%' }}
                      transition={{
                        damping: 30,
                        type: 'spring',
                        stiffness: 300,
                      }}
                      className="mt-auto flex w-full flex-col items-center gap-y-5"
                    >
                      <img
                        alt=""
                        src={CREATORS_DONATE_1.src}
                        className="ml-5 w-max max-w-full sm:ml-auto sm:max-w-[430px]"
                      />

                      <img
                        alt=""
                        src={CREATORS_DONATE_2.src}
                        className="mr-5 w-max max-w-full sm:mr-auto sm:max-w-[430px]"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

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
