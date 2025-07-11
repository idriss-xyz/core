'use client';
import { Button } from '@idriss-xyz/ui/button';
import { GradientBorder } from '@idriss-xyz/ui/gradient-border';
import { TabItem, Tabs } from '@idriss-xyz/ui/tabs';
import { Icon } from '@idriss-xyz/ui/icon';
import { VAULT_DOCS_LINK } from '@idriss-xyz/constants';
import { useMemo } from 'react';

import { backgroundLines2, IDRISS_COIN, IDRISS_SCENE_STREAM } from '@/assets';

import { StakeTabContent, UnstakeTabContent } from './components';
import '@rainbow-me/rainbowkit/styles.css';

export const VaultContent = () => {
  const tabItems: TabItem[] = useMemo(() => {
    return [
      {
        key: 'stake',
        label: (
          <span className="text-label4 text-neutralGreen-700 lg:text-label3">
            LOCK
          </span>
        ),
        children: <StakeTabContent />,
      },
      {
        key: 'unstake',
        label: (
          <span className="text-label4 text-neutralGreen-700 lg:text-label3">
            UNLOCK
          </span>
        ),
        children: <UnstakeTabContent />,
      },
    ];
  }, []);

  return (
    <main className="relative min-h-screen items-center justify-around overflow-hidden bg-[radial-gradient(181.94%_192.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <img
        src={IDRISS_SCENE_STREAM.src}
        className="pointer-events-none absolute left-[-550px] top-[120px] z-1 h-[1007.44px] w-[1614.91px] min-w-[120vw] max-w-none rotate-[48.76deg] lg:left-[-310px] lg:top-[-20px] lg:block lg:h-[1440px] lg:w-[2306.px] lg:rotate-[25.903deg]"
        alt=""
      />
      <img
        src={backgroundLines2.src}
        className="pointer-events-none absolute top-0 hidden size-full opacity-40 lg:block"
        alt=""
      />

      <div className="mt-16 flex flex-col lg:mt-0">
        <div className="z-[5] mt-[40px] inline-flex flex-col items-center gap-[40px] overflow-hidden px-4 pb-3 lg:mt-[100px] lg:[@media(max-height:800px)]:mt-[60px]">
          <img
            className="hidden size-[137px] lg:block"
            src={IDRISS_COIN.src}
            alt=""
          />
          <div className="relative flex flex-col rounded-[36px] bg-[rgba(255,255,255,0.5)] p-5 pb-2 backdrop-blur-[45px] lg:flex-row lg:p-10">
            <GradientBorder
              gradientDirection="toTop"
              gradientStopColor="rgba(145, 206, 154, 0.50)"
              borderWidth={1}
              borderRadius={36}
            />
            <div className="lg:w-[460px]">
              <Tabs items={tabItems} />
            </div>
            <span className="my-4 block h-px w-full bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#76C282_100%)] opacity-50 lg:mx-10 lg:my-0 lg:mt-6 lg:h-auto lg:w-px" />
            <div className="flex flex-col lg:w-[292px]">
              <div className="flex flex-col gap-2">
                <span className="pb-4 text-label4 text-neutralGreen-700 lg:text-label3">
                  VAULT BENEFITS
                </span>
                <div className="flex gap-1.5 lg:gap-2.5">
                  <div className="flex size-6 items-center justify-center">
                    <Icon
                      name="PiggyBank"
                      size={24}
                      className="text-gray-300"
                    />
                  </div>
                  <span className="text-body4 text-neutralGreen-700 lg:text-body3">
                    Earn <span className="gradient-text">12% APR</span> on
                    locked tokens
                  </span>
                </div>
                <div className="flex gap-1.5 lg:gap-2.5">
                  <div className="flex size-6 items-center justify-center">
                    <Icon name="Gem" size={24} className="text-gray-300" />
                  </div>
                  <span className="text-body4 text-neutralGreen-700 lg:text-body3">
                    Lock <span className="gradient-text">10,000 $IDRISS</span>{' '}
                    or more to unlock new premium features
                  </span>
                </div>
                <div className="flex gap-1.5 lg:gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center">
                    <Icon name="PieChart" size={20} className="text-gray-300" />
                  </div>
                  <span className="text-body4 text-neutralGreen-700 lg:text-body3">
                    Access to decentralized revenue sharing in the future
                  </span>
                </div>
              </div>

              <Button
                intent="tertiary"
                size="medium"
                isExternal
                asLink
                className="mb-4 mt-6 w-full lg:mt-8"
                suffixIconName="IdrissArrowRight"
                href={VAULT_DOCS_LINK}
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
