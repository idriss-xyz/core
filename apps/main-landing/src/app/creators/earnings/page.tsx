'use client';
/* eslint-disable @next/next/no-img-element */
import '@rainbow-me/rainbowkit/styles.css';
import { Sidebar } from '@/app/creators/earnings/sidebar';
import { NavigationTabs } from '@/app/creators/earnings/navigation-tabs';
import { Icon } from '@idriss-xyz/ui/icon';
import { Navbar } from '@/app/creators/earnings/navbar';
import { RainbowKitProviders } from '@/app/creators/donate/providers';

// ts-unused-exports:disable-next-line
export default function Earnings() {
  return (
    <RainbowKitProviders>
      <EarningsContent />
    </RainbowKitProviders>
  );
}

function EarningsContent() {
  return (
    <div className="bg-lime-400">
      <div className="flex max-h-[1294px] min-h-[1264px] min-w-[1440px] max-w-[1430px] justify-between bg-[#F6F7F8]">
        <Sidebar />
        <div className="flex min-w-[1166px] max-w-[1196] flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex max-h-[1218] min-h-[1188px] flex-col">
              <Navbar />
              {/*TODO: parent component has another hight className="flex flex-col min-h-[1197px] max-h-[1227px]*/}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2.5">
                        <span className="max-h-[48px] min-h-[18px] min-w-[46px] max-w-[76px] text-body6 text-neutral-800">
                          Earnings
                        </span>
                      </div>
                      <div className="h-[16px] max-h-[46px] min-h-[16px] w-[16px] min-w-[16px] max-w-[46px]">
                        {/*TODO: Icon size should be 16 or 20?*/}
                        <Icon
                          name="IdrissArrowRight"
                          size={16}
                          className="text-black"
                        />
                      </div>

                      <div className="flex gap-2.5">
                        <span className="max-h-[48px] min-h-[18px] min-w-[79px] max-w-[109px] text-body6 text-neutral-800 w-[79px] h-[18px]">
                          Stats & history
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <div className="flex min-w-[213px] max-w-[243px] w-[213px] min-h-[40px] max-h-[70px] h-[40px] items-center">
                        <span className="flex text-heading3 text-[#000A05] min-w-[126px] max-w-[156px] w-[126px] min-h-[40px] max-h-[70px] h-[40px]">
                          Earnings
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>Tabs</div>
              </div>
            </div>
          </div>
        </div>

        {/*<div className="flex w-full flex-col gap-3">*/}
        {/*  <RightTopMenu />*/}
        {/*  <div className="flex flex-col gap-4">*/}
        {/*    <div>*/}
        {/*      <div className="flex w-full items-center gap-2">*/}
        {/*        <span className="text-body6 text-neutral-800">Earnings</span>*/}
        {/*        <Icon*/}
        {/*          name="IdrissArrowRight"*/}
        {/*          size={20}*/}
        {/*          className="text-black"*/}
        {/*        />*/}
        {/*        <span className="text-body6 text-neutral-800">Stats</span>*/}
        {/*      </div>*/}
        {/*      <span className="w-full text-heading3">Earnings</span>*/}
        {/*    </div>*/}
        {/*    <div className="w-full">*/}
        {/*      <NavigationTabs />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
