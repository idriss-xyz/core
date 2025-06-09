'use client';
/* eslint-disable @next/next/no-img-element */
import '@rainbow-me/rainbowkit/styles.css';
import { Sidebar } from '@/app/creators/earnings/sidebar';
import { NavigationTabs } from '@/app/creators/earnings/navigation-tabs';
import { Icon } from '@idriss-xyz/ui/icon';
import { RightTopMenu } from '@/app/creators/earnings/right-top-menu';
import {RainbowKitProviders} from "@/app/creators/donate/providers";

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
    <>
      <div className="flex bg-[#F6F7F8]">
        <Sidebar />

        <div className="flex w-full flex-col">
          <RightTopMenu />
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex w-full items-center gap-2">
                <span className="text-body6 text-neutral-800">Earnings</span>
                <Icon
                  name="IdrissArrowRight"
                  size={20}
                  className="text-black"
                />
                <span className="text-body6 text-neutral-800">Stats</span>
              </div>
              <span className="w-full text-heading3">Earnings</span>
            </div>
            <div className="w-full">
              <NavigationTabs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
